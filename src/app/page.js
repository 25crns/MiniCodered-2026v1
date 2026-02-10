import Image from "next/image";
import styles from "./page.module.css";
import { redirect, RedirectType } from "next/navigation";

export default function Home() {
  redirect('/level_0', RedirectType.replace)
  return (
    <div className={styles.page}>
      home
    </div>
  );
}
