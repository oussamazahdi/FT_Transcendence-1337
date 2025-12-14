import path from "path";

function generateFileNameByUser(username, filename)
{
    const extension = path.extname(filename).toLowerCase();
    const date = Date.now();
    const allowdExts = [".png", ".jpg", ".jpeg", ".webp"];
    if (!allowdExts.includes(extension))
        throw new Error("USUPPORTED_IMAGE_TYPE");
    const file = `${username}-${date}${extension}`
    return file;
}

export { generateFileNameByUser }