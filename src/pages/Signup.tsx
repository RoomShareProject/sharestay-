// src/pages/Signup.tsx
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useAuth } from "../auth/useAuth";
import { useForm } from "react-hook-form";
import FormTextField from "../components/FormTextField";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Roles } from "../auth/types";

const roleOptions: Roles[] = ["GUEST", "HOST"];

const schema = z.object({
  username: z.string().email("올바른 이메일 형식을 입력하세요."),
  password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
  nickname: z.string().min(2, "닉네임은 최소 2자 이상이어야 합니다."),
  address: z.string().min(1, "주소를 입력하세요."),
  phoneNumber: z.string().min(8, "연락처를 입력하세요."),
  lifeStyle: z.string().min(1, "라이프스타일을 입력하세요."),
  role: z.enum(["GUEST", "HOST"]),
});

type FormValues = z.infer<typeof schema>;

export default function Signup() {
  const { signup } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "GUEST" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await signup(values);
      alert("회원가입이 완료되었습니다. 로그인해 주세요.");
      window.location.href = "/login";
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "회원가입에 실패했습니다. 다시 시도해 주세요.";
      alert(message);
    }
  };

  return (
    <Box display="grid" sx={{ placeItems: "center", minHeight: "100vh" }}>
      <Paper sx={{ p: 4, width: 420 }}>
        <Typography variant="h5" fontWeight={700} mb={2}>
          회원가입
        </Typography>
        <Stack spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
          <FormTextField name="username" control={control} label="이메일" />
          <FormTextField
            name="password"
            control={control}
            type="password"
            label="비밀번호"
          />
          <FormTextField name="nickname" control={control} label="닉네임" />
          <FormTextField name="address" control={control} label="주소" />
          <FormTextField name="phoneNumber" control={control} label="연락처" />
          <FormTextField
            name="lifeStyle"
            control={control}
            label="라이프스타일"
            multiline
            minRows={2}
          />
          <FormTextField
            name="role"
            control={control}
            label="역할"
            select
          >
            {roleOptions.map((role) => (
              <MenuItem key={role} value={role}>
                {role === "GUEST" ? "게스트" : "호스트"}
              </MenuItem>
            ))}
          </FormTextField>
          <Button type="submit" variant="contained" disabled={isSubmitting} fullWidth>
            {isSubmitting ? "가입 중..." : "가입하기"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
