type Job = {
  fileId: string;
};

const jobQueue: Job[] = [];

export const enqueueJob = (job: Job) => {
  jobQueue.push(job);
};

export const dequeueJob = (): Job | undefined => {
  return jobQueue.shift();
};
