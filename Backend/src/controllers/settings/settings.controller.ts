import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Body,
} from '@nestjs/common';

import { DatabaseService } from '../../service/database/database.service';

type StaffPublicRow = {
  staff_id: string;
  first_name: string;
  last_name: string;
  birthday: string;
  age: number;
  contact_number: string | null;
  address: string | null;
  email: string;
  date_created: string;
  last_updated: string;
  status: string;
};

function mapStaff(row: StaffPublicRow) {
  return {
    staff_id: row.staff_id,
    first_name: row.first_name,
    last_name: row.last_name,
    birthday: row.birthday,
    age: row.age,
    contact_number: row.contact_number,
    address: row.address,
    email: row.email,
    date_created: row.date_created,
    last_updated: row.last_updated,
    status: row.status,
  };
}

@Controller('settings')
export class SettingsController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get(':staffId')
  async getProfile(@Param('staffId') staffId: string) {
    if (!staffId) {
      throw new BadRequestException('staffId is required');
    }

    const client = this.databaseService.getClient();

    try {
      const result = await client.query<StaffPublicRow>(
        `SELECT staff_id, first_name, last_name, birthday, age, contact_number, address, email, date_created, last_updated, status
         FROM user_staff
         WHERE staff_id = $1
         LIMIT 1`,
        [staffId],
      );

      if (!result.rowCount) {
        throw new NotFoundException('Staff account not found');
      }

      return {
        ok: true,
        staff: mapStaff(result.rows[0]),
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to load settings');
    }
  }

  @Patch(':staffId')
  async updateProfile(
    @Param('staffId') staffId: string,
    @Body()
    body: {
      firstname?: string;
      lastname?: string;
      address?: string | null;
      age?: number;
      contact?: string | null;
    },
  ) {
    if (!staffId) {
      throw new BadRequestException('staffId is required');
    }

    const updates: string[] = [];
    const values: (string | number | null)[] = [];

    if (body.firstname !== undefined) {
      updates.push(`first_name = $${updates.length + 1}`);
      values.push(body.firstname.trim());
    }

    if (body.lastname !== undefined) {
      updates.push(`last_name = $${updates.length + 1}`);
      values.push(body.lastname.trim());
    }

    if (body.address !== undefined) {
      updates.push(`address = $${updates.length + 1}`);
      values.push(body.address?.trim() || null);
    }

    if (body.contact !== undefined) {
      updates.push(`contact_number = $${updates.length + 1}`);
      values.push(body.contact?.trim() || null);
    }

    if (body.age !== undefined) {
      const parsedAge = Number(body.age);
      if (Number.isNaN(parsedAge)) {
        throw new BadRequestException('age must be a number');
      }
      updates.push(`age = $${updates.length + 1}`);
      values.push(parsedAge);
    }

    if (updates.length === 0) {
      throw new BadRequestException('No fields provided to update');
    }

    const setClause = `${updates.join(', ')}, last_updated = now()`;

    const client = this.databaseService.getClient();

    try {
      const result = await client.query<StaffPublicRow>(
        `UPDATE user_staff
         SET ${setClause}
         WHERE staff_id = $${updates.length + 1}
         RETURNING staff_id, first_name, last_name, birthday, age, contact_number, address, email, date_created, last_updated, status`,
        [...values, staffId],
      );

      if (!result.rowCount) {
        throw new NotFoundException('Staff account not found');
      }

      return {
        ok: true,
        staff: mapStaff(result.rows[0]),
        message: 'Settings updated successfully',
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to update settings');
    }
  }
}
