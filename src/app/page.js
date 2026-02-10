import Image from "next/image";
// import styles from "./page.module.css";
import './styles/scrambled.css'
import { redirect, RedirectType } from "next/navigation";

export default function Home() {
  redirect('/level1/backstory_1', RedirectType.replace)
  return (
    <div className={styles.page}>
      home
    </div>
  );
}
