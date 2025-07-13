// @ts-check
import chalk from "chalk";
import { timeFormat } from "../functions/time.js";

const LogLevel = {
	Error: 0,
	Warn: 1,
	Info: 2,
	Off: 3,
};

const seperator = chalk.gray("•");

const logData = {
	[LogLevel.Off]: [undefined, ""],
	[LogLevel.Error]: ["#ED4245", "ERROR"],
	[LogLevel.Success]: ["#57F287", "SUCCESS"],
	[LogLevel.Info]: ["#5865F2", "INFO"],
	[LogLevel.Warn]: ["#FEE75C", "WARN"],
};

const maxLength = Math.max(
	...Object.values(logData).map(
		([color, msg]) =>
			`${chalk.gray(timeFormat(new Date()))} ${color ? chalk.hex(color)(msg) : msg}`.length,
	),
);

export class Logger {
	/**
   * @param {unknown[]} messages
   */
	info(...messages) {
		console.log(this.createLogMessage(LogLevel.Info), ...messages);
	}
	/**
   * @param {unknown[]} messages
   */
	warn(...messages) {
		console.log(this.createLogMessage(LogLevel.Warn), ...messages);
	}
	/**
   * @param {unknown[]} messages
   */
	error(...messages) {
		console.log(this.createLogMessage(LogLevel.Error), ...messages);
	}
	/**
   * @param {unknown[]} messages
   */
	print(...messages) {
		console.log(this.createLogMessage(LogLevel.Off), ...messages);
	}
	/**
   * @param {unknown[]} messages
   */
	success(...messages) {
		console.log(this.createLogMessage(LogLevel.Success), ...messages);
	}

	/**
   *
   * @param {number} logLevel
   * @returns
   */
	createLogMessage(logLevel) {
		const [color, tag] = logData[logLevel];
		const message = `${chalk.gray(timeFormat(new Date()))} ${
			color ? chalk.hex(color)(tag) : tag
		}`;

		return `${message}${" ".repeat(maxLength - message.length)} ${seperator}`;
	}
}