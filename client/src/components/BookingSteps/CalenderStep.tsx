import React, { useState } from "react";
import { Label } from "../ui/label";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { CalendarIcon, Clock } from "lucide-react";
import { convertTo24Hour, toLocalYMD } from "@/lib/dateUtills";
import { startOfDay } from "date-fns";

interface CalendarStepProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedSlot: string;
  setSelectedSlot: (slot: string) => void;
  availableSlots: string[];
  availableDates: string[];
  excludedWeekdays: number[];
  onContinue: () => void;
  bookedSlots: string[];
}
const CalendarStep = ({
  selectedDate,
  selectedSlot,
  setSelectedDate,
  setSelectedSlot,
  availableDates,
  availableSlots,
  onContinue,
  bookedSlots,
  excludedWeekdays,
}: CalendarStepProps) => {
  const [showMoreSlots, setShowMoreSlots] = useState(false);
  const displaySlots = showMoreSlots
    ? availableSlots
    : availableSlots.slice(0, 10);

  const isSlotBooked = (slot: string): boolean => {
    if (!selectedDate) return false;
    const dateString = toLocalYMD(selectedDate);
    const slotDateTime = new Date(`${dateString}T${convertTo24Hour(slot)}`);

    return bookedSlots.some((bookedSlot) => {
      const bookedDateTime = new Date(bookedSlot);
      return bookedDateTime.getTime() === slotDateTime.getTime();
    });
  };

  const isSlotInPast = (slot: string): boolean => {
    if (!selectedDate) return false;
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDay = new Date(selectedDate);
    selectedDay.setHours(0, 0, 0, 0);

    //Only apply this checkl for today date
    if (selectedDay.getTime() === today.getTime()) {
      const [time, modifier] = slot.split(" ");
      let [hour, minutes] = time.split(":");

      if (hour === "12") {
        hour = "00";
      }

      if (modifier === "PM") {
        hour = String(parseInt(hour, 10) + 12);
      }

      const slotDateTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        parseInt(hour, 10),
        parseInt(minutes, 10),
        0,
      );

      const bufferedCurrentTime = new Date(now.getTime() + 5 * 60 * 1000);
      return slotDateTime.getTime() <= bufferedCurrentTime.getTime();
    }
    return false;
  };

  const isDateDisabled = (date: Date): boolean => {
    const today = startOfDay(new Date());
    const checkedDate = startOfDay(date);

    if (checkedDate < today) return true;

    //check if date is in avaible range
    const ymd = toLocalYMD(date);
    if (!availableDates.includes(ymd)) return true;

    //check weekday exclusion
    const jsWeekday = date.getDay(); //0= sunday
    return excludedWeekdays.includes(jsWeekday);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Main Card */}
      <div className="grid md:grid-cols-2 gap-6 bg-white border border-gray-100 rounded-3xl shadow-lg p-6">
        {/* LEFT - Calendar */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Choose Date
          </Label>

          <div className="rounded-2xl border p-4 bg-gray-50">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={isDateDisabled}
              className="rounded-md"
              classNames={{
                day_selected: "bg-blue-600 text-white hover:bg-blue-600",
                day_today: "bg-blue-100 text-blue-900 font-semibold",
                day_disabled: "text-gray-300 opacity-50 cursor-not-allowed",
              }}
            />
          </div>
        </div>

        {/* RIGHT - Slots */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Available Slots
            {availableSlots.length > 0 && (
              <span className="ml-2 text-xs text-gray-400">
                ({availableSlots.length} available)
              </span>
            )}
          </Label>

          {/* States */}
          {!selectedDate ? (
            <div className="flex flex-col items-center justify-center h-60 text-gray-400">
              <CalendarIcon className="w-12 h-12 mb-3 opacity-40" />
              <p className="text-sm">Select a date to view slots</p>
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60 text-gray-400">
              <Clock className="w-12 h-12 mb-3 opacity-40" />
              <p className="text-sm">No slots available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Slots Grid */}
              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                {displaySlots.map((slot) => {
                  const isSelected = selectedSlot === slot;
                  const isBooked = isSlotBooked(slot);
                  const isPast = isSlotInPast(slot);
                  const isDisabled = isBooked || isPast;

                  return (
                    <button
                      key={slot}
                      disabled={isDisabled}
                      onClick={() => !isDisabled && setSelectedSlot(slot)}
                      className={`
                      flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium border transition
                      
                      ${
                        isDisabled
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                          : isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-md"
                            : "bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-300"
                      }
                    `}
                    >
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {slot}
                      </span>

                      {isBooked && !isPast && (
                        <span className="text-[10px] opacity-70">Booked</span>
                      )}
                      {isPast && (
                        <span className="text-[10px] opacity-70">Past</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Show More */}
              {availableSlots.length > 10 && (
                <button
                  onClick={() => setShowMoreSlots(!showMoreSlots)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {showMoreSlots
                    ? "Show less"
                    : `+ ${availableSlots.length - 10} more slots`}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="flex justify-end">
        <Button
          onClick={onContinue}
          disabled={!selectedDate || !selectedSlot}
          className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default CalendarStep;
