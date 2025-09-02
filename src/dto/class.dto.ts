export type CreateClassTemplateDTO = {
  name: string;
  description?: string;
  capacity: number;
  center_id: number;
};

export type CreateClassSessionDTO = {
  startDateTime: string;
  endDateTime: string;
  template_id: number;
  center_id: number;
};
