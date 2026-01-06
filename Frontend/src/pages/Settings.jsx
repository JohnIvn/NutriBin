import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Requests from "@/utils/Requests";
import { useUser } from "@/contexts/UserContext";

const settingsSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  age: z.number().min(1, "Age is required"),
  number: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((value) => value === "" || value.length >= 7, {
      message: "Contact number is too short",
    }),
});

function Settings() {
  const { user, login } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      address: "",
      age: 0,
      number: "",
    },
  });

  useEffect(() => {
    if (!user?.staff_id) {
      setLoadingProfile(false);
      return;
    }

    loadProfile();
  }, [user?.staff_id]);

  const loadProfile = async () => {
    if (!user?.staff_id) return;

    try {
      setLoadingProfile(true);
      const response = await Requests({
        url: `/settings/${user.staff_id}`,
        method: "GET",
        credentials: true,
      });

      if (response.data?.ok && response.data?.staff) {
        const staff = response.data.staff;
        form.reset({
          firstname: staff.first_name || "",
          lastname: staff.last_name || "",
          address: staff.address || "",
          age: staff.age ?? 0,
          gender: "male",
          number: staff.contact_number || "",
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load account settings"
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  const onSubmit = async (values) => {
    if (!user?.staff_id) return;

    try {
      setSaving(true);
      const response = await Requests({
        url: `/settings/${user.staff_id}`,
        method: "PATCH",
        credentials: true,
        data: {
          firstname: values.firstname,
          lastname: values.lastname,
          address: values.address,
          age: Number(values.age),
          contact: values.number?.toString() || null,
        },
      });

      if (response.data?.ok) {
        toast.success("Settings updated successfully");
        setEditMode(false);

        if (response.data.staff) {
          login(response.data.staff);
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update account settings"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="flex flex-col min-h-full h-auto w-3/4 m-auto rounded-xl justify-start items-center p-4 gap-2">
      <section className="flex flex-col lg:flex-row w-full h-full py-2 gap-2">
        <Form {...form}>
          <form
            className="w-full max-w-3xl space-y-6 text-black shadow shadow-gray-600 p-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <h1 className="text-black text-4xl font-medium">
              Account Settings
            </h1>

            {loadingProfile && (
              <p className="text-sm text-gray-600">Loading account...</p>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!editMode || loadingProfile}
                        placeholder="First Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!editMode || loadingProfile}
                        placeholder="Last Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!editMode || loadingProfile}
                      placeholder="Complete Address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={!editMode || loadingProfile}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        disabled={!editMode || loadingProfile}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4 my-4">
              <Button
                type={"button"}
                className={`${
                  editMode ? "hidden" : "flex"
                } min-w-48 w-auto h-12 p-2 bg-secondary hover:bg-secondary-foreground cursor-pointer`}
                onClick={() => setEditMode(true)}
                disabled={loadingProfile}
              >
                Edit
              </Button>
              <Button
                type={"submit"}
                className={`${
                  editMode ? "flex" : "hidden"
                } min-w-48 w-auto h-12 p-2 bg-gray-800 hover:bg-gray-600 cursor-pointer`}
                disabled={saving}
              >
                Submit
              </Button>
              <Button
                type={"button"}
                className={`${
                  editMode ? "flex" : "hidden"
                } min-w-48 w-auto h-12 p-2 bg-gray-800 hover:bg-gray-600 cursor-pointer`}
                onClick={() => {
                  setEditMode(false);
                  loadProfile();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>

        <div className="flex lg:flex-col justify-center items-start h-full w-full lg:w-1/3 gap-2">
          <div className="flex flex-col justify-center items-center h-64 p-4 gap-4 shadow shadow-gray-600">
            <h1 className="text-2xl font-medium text-black text-center w-full">
              Reset Password
            </h1>
            <hr className="w-full shadow-2xl" />
            <p className="text-black text-start text-xl font-light w-full">
              You can request to change your password by clicking the button
              below that will be sent through email.
            </p>
            <Button
              className={
                "flex w-full h-12 p-2 bg-sky-700 hover:bg-sky-400 cursor-pointer"
              }
            >
              Reset
            </Button>
          </div>
          <div className="flex flex-col justify-center items-center h-64 p-4 gap-4 shadow shadow-gray-600">
            <h1 className="text-2xl font-medium text-black text-center w-full">
              Close Account
            </h1>
            <hr className="w-full shadow-2xl" />
            <p className="text-black text-start text-xl font-light w-full">
              You can request to change your password by clicking the button
              below that will be sent through email.
            </p>
            <Button
              className={
                "flex w-full h-12 p-2 bg-secondary hover:bg-secondary-foreground cursor-pointer"
              }
            >
              Reset
            </Button>
          </div>
        </div>
      </section>
    </section>
  );
}

export default Settings;
