import { zodResolver } from "@hookform/resolvers/zod";
import { startOfDay } from "date-fns";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import DropdownHeader from "../../DropdownHeader";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { closeAllDropDown } from "@/store/CardModalStatesSlice";
import { useAddCardDateMutation } from "@/store/cardApi";
import { useParams } from "react-router-dom";

const FormSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export function DateCalendar({ cardId }: { cardId: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { workspaceId } = useParams();
  const [addDate] = useAddCardDateMutation();
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    if (!data.endDate && !data.startDate) {
      dispatch(closeAllDropDown());
      return;
    }
    const body = {
      workspaceId: workspaceId!,
      cardId,
      startDate: data.startDate ? data.startDate.toISOString() : "",
      endDate: data.endDate ? data.endDate.toISOString() : "",
    };
    try {
      dispatch(closeAllDropDown());

      await addDate(body);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      data-ignore-click-outside="true"
      className=" absolute bg-[#282E33] -top-50"
    >
      <div className="p-2">
        <DropdownHeader headerText="Add dates to card" />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-textP">Add a Start date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal rounded cursor-pointer items-center transition-colors duration-150 bg-[#B6C2CF]/20 hover:bg-[#B6C2CF]/10 font-charlie-display-sm shadow-2xl text-[#B3BFCC] hover:text-[#B3BFCC]/90",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 z-[20000]"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < startOfDay(new Date())}
                      className="bg-[#F5F8FA] rounded-lg p-2 shadow-lg"
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription className="text-textP">
                  Add a start date to this card
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-textP">Add a Due date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal rounded cursor-pointer items-center transition-colors duration-150 bg-[#B6C2CF]/20 hover:bg-[#B6C2CF]/10 font-charlie-display-sm shadow-2xl text-[#B3BFCC] hover:text-[#B3BFCC]/90",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 z-[20000]"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < startOfDay(new Date())}
                      className="bg-[#F5F8FA] rounded-lg p-2 shadow-lg"
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription className="text-textP">
                  Add a due to date to this card
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className=" text-left font-normal rounded cursor-pointer items-center transition-colors duration-150 bg-[#B6C2CF]/20 hover:bg-[#B6C2CF]/10 font-charlie-display-sm shadow-2xl text-[#B3BFCC] hover:text-[#B3BFCC]/90"
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
export default DateCalendar;
