import * as React from "react";
import classNames from "clsx";
import CSSTransition from "react-transition-group/CSSTransition";

type DropdownWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  opened: boolean;
};

const DropdownWrapper: React.FC<DropdownWrapperProps> = ({
  opened,
  className,
  style = {},
  ...rest
}) => (
  <CSSTransition
    in={opened}
    timeout={100}
    classNames={{
      enter: "transform opacity-0 scale-95",
      enterActive: classNames(
        "transform opacity-100 scale-100",
        "transition ease-out duration-100"
      ),
      exit: classNames(
        "transform opacity-0 scale-95",
        "transition ease-in duration-100"
      )
    }}
    unmountOnExit
  >
    <div
      className={classNames(
        "mt-2",
        "border",
        "rounded-md overflow-hidden",
        "shadow-xl",
        "p-2",
        className
      )}
      style={{
        backgroundColor: "#1b262c",
        borderColor: "#212e36",
        ...style
      }}
      {...rest}
    />
  </CSSTransition>
);

export default DropdownWrapper;
