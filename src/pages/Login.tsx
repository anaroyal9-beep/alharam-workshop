import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.jpg";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "alharam" && password === "pro12345") {
      sessionStorage.setItem("auth", "true");
      navigate("/", { replace: true });
    } else {
      setError(t("loginError"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sidebar-background to-sidebar-accent p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardContent className="pt-8 pb-8 px-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-28 h-28 rounded-2xl overflow-hidden bg-white shadow-lg mb-4">
              <img src={logo} alt="شعار الشركة" className="w-full h-full object-contain p-2" />
            </div>
            <h1 className="text-xl font-extrabold text-foreground text-center leading-relaxed">
              ورشة الهرم المثالي للآلات والمعدات
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username">{t("username")}</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
                placeholder={t("enterUsername")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder={t("enterPassword")}
              />
            </div>

            {error && (
              <p className="text-sm font-bold text-destructive text-center bg-destructive/10 rounded-lg py-2">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full text-base h-12">
              {t("login")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
