import {CloudWatchClient, PutMetricDataCommand, StandardUnit} from "@aws-sdk/client-cloudwatch";
import { Elysia } from "elysia";

export interface MetricValue {
    metricName: string;
    metricValue: number;
    dimensions: Array<{
        Name: string;
        Value: string;
    }>;
    unit: StandardUnit;
}

const cwClient = new CloudWatchClient({});
const publishCustomMetric = async (metric: MetricValue) => {
    try {
        const command = new PutMetricDataCommand({
            MetricData: [
                {
                    MetricName: metric.metricName,
                    Dimensions: metric.dimensions,
                    Unit: metric.unit,
                    Value: metric.metricValue,
                },
            ],
            Namespace: "CALCULATOR/SERVICE",
        });

        await cwClient.send(command);
    } catch (e) {
        console.error("Failed to push metric to CW..", e);
    }
}

const validateInput = (a: string, b: string): boolean => {
    return !isNaN(Number(a)) && !isNaN(Number(b));
}

const app = new Elysia()
    .get("/", () => "Hello Elysia")
    .get("/add/:a/:b", async ({ params: { a, b }, error }) => {
        await publishCustomMetric({
            metricName: "Invoke",
            metricValue: 1,
            dimensions: [{
                Name: "Operation",
                Value: "Add",
            }],
            unit: StandardUnit.Count
        });

        if (!validateInput(a, b)) {
            await publishCustomMetric({
                metricName: "Error",
                metricValue: 1,
                dimensions:[
                    {
                        Name: "HttpError",
                        Value: "4xx",
                    },
                    {
                        Name: "Operation",
                        Value: "Add",
                    }
                ],
                unit: StandardUnit.Count
            });
            return error(400, { error: "Invalid Input" });
        }

        return {
            result: parseInt(a) + parseInt(b)
        }
    })
    .get("/subtract/:a/:b", async ({ params: { a, b }, error }) => {
        await publishCustomMetric({
            metricName: "Invoke",
            metricValue: 1,
            dimensions: [{
                Name: "Operation",
                Value: "Subtract",
            }],
            unit: StandardUnit.Count
        });

        if (!validateInput(a, b)) {
            await publishCustomMetric({
                metricName: "Error",
                metricValue: 1,
                dimensions:[
                    {
                        Name: "HttpError",
                        Value: "4xx",
                    },
                    {
                        Name: "Operation",
                        Value: "Subtract",
                    }
                ],
                unit: StandardUnit.Count
            });
            return error(400, { error: "Invalid Input" });
        }

        return {
            result: parseInt(a) - parseInt(b)
        }
    })
    .get("/multiply/:a/:b", async ({ params: { a, b }, error }) => {
        await publishCustomMetric({
            metricName: "Invoke",
            metricValue: 1,
            dimensions: [{
                Name: "Operation",
                Value: "Multiply",
            }],
            unit: StandardUnit.Count
        });

        if (!validateInput(a, b)) {
            await publishCustomMetric({
                metricName: "Error",
                metricValue: 1,
                dimensions:[
                    {
                        Name: "HttpError",
                        Value: "4xx",
                    },
                    {
                        Name: "Operation",
                        Value: "Multiply",
                    }
                ],
                unit: StandardUnit.Count
            });
            return error(400, { error: "Invalid Input" });
        }

        return {
            result: parseInt(a) * parseInt(b)
        }
    })
    .get("/divide/:a/:b", async ({ params: { a, b }, error }) => {
        await publishCustomMetric({
            metricName: "Invoke",
            metricValue: 1,
            dimensions: [{
                Name: "Operation",
                Value: "Divide",
            }],
            unit: StandardUnit.Count
        });

        if (!validateInput(a, b)) {
            await publishCustomMetric({
                metricName: "Error",
                metricValue: 1,
                dimensions:[
                    {
                        Name: "HttpError",
                        Value: "4xx",
                    },
                    {
                        Name: "Operation",
                        Value: "Divide",
                    }
                ],
                unit: StandardUnit.Count
            });
            return error(400, { error: "Invalid Input" });
        }

        try {
            if (parseInt(b) === 0) {
                throw new Error("Cannot divide by Zero")
            }

            return {
                result: parseInt(a) / parseInt(b)
            }
        } catch (e) {
            console.error("Failed to divide..", e);
            await publishCustomMetric({
                metricName: "Error",
                metricValue: 1,
                dimensions:[
                    {
                        Name: "HttpError",
                        Value: "5xx",
                    },
                    {
                        Name: "Operation",
                        Value: "Divide",
                    }
                ],
                unit: StandardUnit.Count
            });
            return error(500, { error: `Failed to divide ${a} / ${b}`, reason: e });
        }

    })
    .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
