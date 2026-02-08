import { Button, Stack, TextField, Typography } from "@mui/material";

type Field = {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
};

type AuthFormProps = {
  fields: Field[];
  submitLabel: string;
  error?: string;
  onSubmit: () => void;
};

export const AuthForm = ({ fields, submitLabel, error, onSubmit }: AuthFormProps) => (
  <Stack spacing={3}>
    {fields.map((field, i) => (
      <TextField
        key={i}
        label={field.label}
        type={field.type ?? "text"}
        fullWidth
        value={field.value}
        onChange={(e) => field.onChange(e.target.value)}
      />
    ))}

    {error && (
      <Typography color="error" variant="caption">
        {error}
      </Typography>
    )}

    <Button variant="highlighted" fullWidth onClick={onSubmit}>
      {submitLabel}
    </Button>
  </Stack>
);
