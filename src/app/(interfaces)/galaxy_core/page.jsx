"use client"

import Image from "next/image";
import GalaxyCore from "../../../../public/assets/GalaxyCore.jpg";
import styles from "./galaxy_core.module.css";

export default function Page() {
    return (
        <div className={styles.container}>
            <Image
                src={GalaxyCore.src}
                alt="Galaxy Core"
                fill
                style={{ objectFit: "contain", objectPosition: "center" }}
                priority
            />
        </div>
    );
}
