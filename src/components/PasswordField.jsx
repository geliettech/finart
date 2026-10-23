import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

const PasswordField = ({
  id,
  field,
  invalid,
  describedBy,
  autoComplete = "current-password",
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        {...field}
        id={id}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className="h-12 rounded-xl px-3 pr-12"
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
 className="absolute right-1 top-1 flex size-10 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-surface-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring "
      >
        {visible ? (
          <EyeOff aria-hidden="true" size={18} />
        ) : (
          <Eye aria-hidden="true" size={18} />
        )}
      </button>
    </div>
  );
};

export default PasswordField;
