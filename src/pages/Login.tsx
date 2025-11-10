// src/pages/Login.tsx
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useAuth } from "../auth/useAuth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormTextField from "../components/FormTextField";

const schema = z.object({
  username: z.string().min(1, "이메일을 입력하세요.").email("올바른 이메일 형식이어야 합니다."),
  password: z.string().min(0, "비밀번호는 최소 8자 이상이어야 합니다."),
});

type FormValues = z.infer<typeof schema>;

export default function Login() {
  const { login } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await login(values.username, values.password);
      window.location.href = "/";
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "로그인에 실패했습니다.";
      alert(message);
    }
  };

  return (
    <Box display="grid" sx={{ placeItems: "center" }} minHeight="100vh">
      <Paper sx={{ p: 4, width: 360 }}>
        <Typography variant="h5" fontWeight={700} mb={2}>
          로그인
        </Typography>
        <Stack spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
          <FormTextField name="username" control={control} label="이메일" />
          <FormTextField
            name="password"
            control={control}
            type="password"
            label="비밀번호"
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            fullWidth
          >
            {isSubmitting ? "로그인 중..." : "로그인"}
          </Button>
        </Stack>

        <Button fullWidth sx={{ mt: 2 }} href="/signup">
          회원가입
        </Button>
      </Paper>
    </Box>
  );
}
