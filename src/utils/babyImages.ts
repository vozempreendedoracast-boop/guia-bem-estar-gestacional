import babyWeek04 from "@/assets/baby-week-04.png";
import babyWeek08 from "@/assets/baby-week-08.png";
import babyWeek12 from "@/assets/baby-week-12.png";
import babyWeek16 from "@/assets/baby-week-16.png";
import babyWeek20 from "@/assets/baby-week-20.png";
import babyWeek24 from "@/assets/baby-week-24.png";
import babyWeek28 from "@/assets/baby-week-28.png";
import babyWeek32 from "@/assets/baby-week-32.png";
import babyWeek36 from "@/assets/baby-week-36.png";
import babyWeek40 from "@/assets/baby-week-40.png";

const babyImages: Record<number, string> = {
  4: babyWeek04,
  8: babyWeek08,
  12: babyWeek12,
  16: babyWeek16,
  20: babyWeek20,
  24: babyWeek24,
  28: babyWeek28,
  32: babyWeek32,
  36: babyWeek36,
  40: babyWeek40,
};

const milestones = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40];

export function getBabyImage(weekNumber: number): string {
  // Find the closest milestone that is <= weekNumber
  let closest = milestones[0];
  for (const m of milestones) {
    if (m <= weekNumber) closest = m;
    else break;
  }
  return babyImages[closest];
}
