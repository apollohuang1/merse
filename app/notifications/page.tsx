import Link from "next/link";
import React from "react";

type Props = {};

const NotificationPage = (props: Props) => {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <span>TO DO, Notifications page, go back {"\n"} <Link href={"/"} className="text-accent underline">home</Link></span>
    </div>
  );
};

export default NotificationPage;
