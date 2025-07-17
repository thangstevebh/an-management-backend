import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

type Dayjs = dayjs.Dayjs;

dayjs.extend(utc);
dayjs.extend(timezone);

const DEFAULT_TIME_FORMAT = "YYYY-MM-DDTHH:mm:ssZ";

const toUtc = function toUtc(time: Dayjs, format = DEFAULT_TIME_FORMAT) {
  return dayjs(time).utc().format(format);
};

const toGMT7 = (time: Dayjs, format = DEFAULT_TIME_FORMAT) => {
  return dayjs(time).tz("Asia/Ho_Chi_Minh").format(format);
};

export { dayjs, toUtc, toGMT7 };
