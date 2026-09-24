import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      category,
      author_name,
      author_nim,
      sender_email,
      tech_stack,
      cover_image,
      github_url,
      demo_url,
      orbit_url,
      description,
      content,
    } = body;

    // Validation for strictly required fields
    if (!title?.trim() || !author_name?.trim() || !sender_email?.trim() || !description?.trim()) {
      return NextResponse.json(
        { success: false, error: "Harap isi seluruh bidang wajib (Judul, Nama Pembuat, Email, dan Ringkasan)." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;

    // Format optional links cleanly (show '-' if empty)
    const formattedGithub = github_url?.trim() ? github_url.trim() : "-";
    const formattedDemo = demo_url?.trim() ? demo_url.trim() : "-";
    const formattedOrbit = orbit_url?.trim() ? orbit_url.trim() : "-";

    const displayCoverHtml = cover_image?.trim()
      ? `<div style="margin-top: 20px; text-align: center;">
          <p style="color: #1DB954; font-weight: bold; margin-bottom: 8px;">Cover Image / Gambar Preview:</p>
          <img src="${cover_image.trim()}" alt="Preview Karya" style="max-width: 100%; max-height: 320px; border-radius: 12px; border: 1px solid #333; object-fit: cover;" />
          ${!cover_image.startsWith("data:image") ? `<p style="font-size: 11px; color: #888; margin-top: 4px;">URL: ${cover_image.trim()}</p>` : ""}
         </div>`
      : `<div style="margin-top: 15px; font-size: 12px; color: #888;">Gambar Cover: <i>(Tidak dilampirkan)</i></div>`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #0B0D14; color: #FFFFFF; padding: 25px; border-radius: 16px; border: 1px solid #1DB954;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #222;">
          <h2 style="color: #1DB954; margin: 0; font-size: 24px;">🚀 Pengajuan Karya Baru Mahasiswa</h2>
          <p style="color: #B3B3B3; font-size: 14px; margin-top: 5px;">HMPSTI SWU Showcase Submission</p>
        </div>

        <div style="margin-top: 20px;">
          <table style="width: 100%; border-collapse: collapse; color: #FFFFFF; font-size: 14px;">
            <tr>
              <td style="padding: 10px 0; color: #1DB954; font-weight: bold; width: 150px;">Judul Karya:</td>
              <td style="padding: 10px 0; font-size: 16px; font-weight: bold;">${title}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #1DB954; font-weight: bold;">Kategori:</td>
              <td style="padding: 10px 0;">${category || "Web Application"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #1DB954; font-weight: bold;">Pembuat / Tim:</td>
              <td style="padding: 10px 0;">${author_name} ${author_nim?.trim() ? `(NIM: ${author_nim.trim()})` : ""}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #1DB954; font-weight: bold;">Email Pengirim:</td>
              <td style="padding: 10px 0; color: #00F2FE;"><a href="mailto:${sender_email}" style="color: #00F2FE;">${sender_email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #1DB954; font-weight: bold;">Teknologi (Stack):</td>
              <td style="padding: 10px 0;">${tech_stack || "-"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #1DB954; font-weight: bold;">GitHub Repositori:</td>
              <td style="padding: 10px 0;">
                ${formattedGithub !== "-" ? `<a href="${formattedGithub}" style="color: #00F2FE;" target="_blank">${formattedGithub}</a>` : "-"}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #1DB954; font-weight: bold;">Live Demo / App:</td>
              <td style="padding: 10px 0;">
                ${formattedDemo !== "-" ? `<a href="${formattedDemo}" style="color: #00F2FE;" target="_blank">${formattedDemo}</a>` : "-"}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #1DB954; font-weight: bold;">Profil Orbit Pembuat:</td>
              <td style="padding: 10px 0;">
                ${formattedOrbit !== "-" ? `<a href="${formattedOrbit}" style="color: #00F2FE;" target="_blank">${formattedOrbit}</a>` : "-"}
              </td>
            </tr>
          </table>
        </div>

        ${displayCoverHtml}

        <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #222;">
          <h4 style="color: #1DB954; margin: 0 0 8px 0;">Ringkasan Singkat Karya:</h4>
          <p style="background: #121520; padding: 12px; border-radius: 8px; font-size: 14px; line-height: 1.6; margin: 0; color: #DDD;">${description}</p>
        </div>

        ${
          content?.trim()
            ? `<div style="margin-top: 20px;">
                <h4 style="color: #1DB954; margin: 0 0 8px 0;">Penjelasan Lengkap (Dokumentasi):</h4>
                <div style="background: #121520; padding: 15px; border-radius: 8px; font-size: 13px; line-height: 1.6; color: #DDD; white-space: pre-wrap;">${content}</div>
               </div>`
            : ""
        }

        <div style="margin-top: 30px; text-align: center; padding-top: 15px; border-top: 1px solid #222; font-size: 12px; color: #777;">
          Pesan ini dikirim otomatis via Formulir Pengajuan Karya Website HMPSTI STMIK Widya Utama.
        </div>
      </div>
    `;

    if (!apiKey) {
      console.warn("RESEND_API_KEY tidak ditemukan di process.env.RESEND_API_KEY");
      return NextResponse.json({
        success: true,
        isSimulated: true,
        message: "Pengajuan karya disimulasikan (RESEND_API_KEY tidak terdeteksi).",
      });
    }

    const resend = new Resend(apiKey);

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "HMPSTI Showcase <onboarding@resend.dev>",
      to: ["hmpstiswu@gmail.com"],
      replyTo: sender_email,
      subject: `[SUBMISSION KARYA] ${title} - ${author_name}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend API Error Detail:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Gagal mengirim email via Resend.",
          resendError: error,
        },
        { status: 400 }
      );
    }

    console.log("Resend Email Success:", data);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Submit Karya Route Exception:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Terjadi kesalahan server saat mengirim email." },
      { status: 500 }
    );
  }
}
