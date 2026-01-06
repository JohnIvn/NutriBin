import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { DatabaseService } from '../../service/database/database.service';

type RepairRow = {
  repair_id: string;
  user_id: string | null;
  machine_id: string | null;
  repair_status: string;
  date_created: string;
  first_name?: string | null;
  last_name?: string | null;
};

@Controller('management/repair')
export class RepairManagementController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  async getAllRepairs() {
    const client = this.databaseService.getClient();

    try {
      const result = await client.query<RepairRow>(
        `SELECT repair_id, user_id, machine_id, repair_status, date_created, first_name, last_name
         FROM repair
         ORDER BY date_created DESC`,
      );

      return {
        ok: true,
        repairs: result.rows,
      };
    } catch {
      throw new InternalServerErrorException('Failed to fetch repair list');
    }
  }

  @Get(':id')
  async getRepairById(@Param('id') id: string) {
    const client = this.databaseService.getClient();

    try {
      const result = await client.query<RepairRow>(
        `SELECT repair_id, user_id, machine_id, repair_status, date_created, first_name, last_name
         FROM repair
         WHERE repair_id = $1`,
        [id],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException('Repair not found');
      }

      return {
        ok: true,
        repair: result.rows[0],
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch repair');
    }
  }

  @Post()
  async createRepair(@Body() createData: any) {
    const client = this.databaseService.getClient();

    try {
      const { user_id, machine_id, repair_status } = createData;

      const result = await client.query<RepairRow>(
        `INSERT INTO repair (user_id, machine_id, repair_status)
         VALUES ($1, $2, $3)
         RETURNING repair_id, user_id, machine_id, repair_status, date_created`,
        [user_id || null, machine_id || null, repair_status || 'active'],
      );

      return {
        ok: true,
        repair: result.rows[0],
      };
    } catch {
      throw new InternalServerErrorException('Failed to create repair');
    }
  }

  @Put(':id')
  async updateRepair(@Param('id') id: string, @Body() updateData: any) {
    const client = this.databaseService.getClient();

    try {
      const { user_id, machine_id, repair_status } = updateData;

      const result = await client.query<RepairRow>(
        `UPDATE repair
         SET user_id = $1, machine_id = $2, repair_status = $3
         WHERE repair_id = $4
         RETURNING repair_id, user_id, machine_id, repair_status, date_created`,
        [user_id, machine_id, repair_status, id],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException('Repair not found');
      }

      return {
        ok: true,
        repair: result.rows[0],
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update repair');
    }
  }

  @Patch(':id/status')
  async updateRepairStatus(
    @Param('id') id: string,
    @Body() statusData: { status: string },
  ) {
    const client = this.databaseService.getClient();

    try {
      const { status } = statusData;

      if (!['active', 'cancelled', 'postponed'].includes(status)) {
        throw new BadRequestException('Invalid status value');
      }

      const result = await client.query<RepairRow>(
        `UPDATE repair
         SET repair_status = $1
         WHERE repair_id = $2
         RETURNING repair_id, user_id, machine_id, repair_status, date_created`,
        [status, id],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException('Repair not found');
      }

      return {
        ok: true,
        repair: result.rows[0],
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update repair status');
    }
  }

  @Delete(':id')
  async deleteRepair(@Param('id') id: string) {
    const client = this.databaseService.getClient();

    try {
      const result = await client.query(
        'DELETE FROM repair WHERE repair_id = $1 RETURNING repair_id',
        [id],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException('Repair not found');
      }

      return {
        ok: true,
        message: 'Repair deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete repair');
    }
  }
}
