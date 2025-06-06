import StaticPage from "@/components/StaticPage";

export default function ContactPage() {
    return (
        <StaticPage title="Contact">
            <p>
                This project was developed by Atharv More & Pratham Oza as part of a college final year project.
            </p>
            <p>
                For any questions about this project, please contact the project author via email.
            </p>
            <p>
                Email contact: <a href="mailto:your-atharvmore30@gmail.com" className="text-primary hover:underline">atharvmore30@example.com</a>
            </p>
            <p>
                Contact Number:{" "}
                <strong>
                    <u>Atharv</u> - <u>+91 9167356290</u>
                </strong>{" "}
                &nbsp; &amp; &nbsp;
                <strong>
                    <u>Pratham</u> - <u>+91 9867745441</u>
                </strong>
            </p>
        </StaticPage>
    );
}
