// src/components/SiteHeader.tsx
import { AppBar, Box, Button, Stack, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import type { Roles } from "../auth/types";

const navLinks: { label: string; href: string; requireRoles?: Roles[] }[] = [
  { label: "홈", href: "/" },
  { label: "안전 지도", href: "/safety-map" },
  { label: "이용 가이드", href: "/guide" },
  { label: "룸 등록", href: "/list-room", requireRoles: ["HOST", "ADMIN"] },
];

type Props = { activePath?: string };

export default function SiteHeader(_: Props) {
  const { user, isLoading, logout } = useAuth();
  const roles = user?.roles ?? (user?.role ? [user.role] : []);

  const allowedLinks = navLinks.filter((link) => {
    if (!link.requireRoles) return true;
    return roles.some((role) => link.requireRoles?.includes(role));
  });

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ borderBottom: "1px solid", borderColor: "divider" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          component={RouterLink}
          to="/"
          variant="h6"
          fontWeight={700}
          color="inherit"
          sx={{ textDecoration: "none" }}
        >
          ShareStay+
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          {allowedLinks.map((link) => (
            <Button key={link.href} component={RouterLink} to={link.href} color="inherit">
              {link.label}
            </Button>
          ))}
        </Stack>

        <Box>
          {isLoading ? (
            <Typography variant="body2" color="text.secondary">
              Loading...
            </Typography>
          ) : user ? (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography variant="body2" fontWeight={600}>
                {user.nickname ?? user.email ?? user.username}
              </Typography>
              <Button component={RouterLink} to="/profile" color="inherit">
                프로필
              </Button>
              <Button onClick={logout} color="inherit">
                로그아웃
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button component={RouterLink} to="/login" color="inherit">
                로그인
              </Button>
              <Button component={RouterLink} to="/signup" variant="contained">
                회원가입
              </Button>
            </Stack>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
