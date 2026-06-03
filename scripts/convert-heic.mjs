import convert from 'heic-convert';
import { readdir, readFile, writeFile } from 'fs/promises';
import { join, extname, basename } from 'path';

const DIR = './public/PRODUTOS E LOGO/fotos para a capa parte de cima do site';

async function convertAll() {
  const files = await readdir(DIR);
  const heicFiles = files.filter(f => extname(f).toLowerCase() === '.heic');
  
  if (heicFiles.length === 0) {
    console.log('No HEIC files found.');
    return;
  }

  for (const file of heicFiles) {
    const inputPath = join(DIR, file);
    const outputName = basename(file, extname(file)) + '.jpg';
    const outputPath = join(DIR, outputName);
    
    console.log(`Converting: ${file} → ${outputName}`);
    
    const inputBuffer = await readFile(inputPath);
    const outputBuffer = await convert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 0.9
    });
    
    await writeFile(outputPath, Buffer.from(outputBuffer));
    console.log(`  ✅ Done: ${outputPath}`);
  }
  
  console.log(`\nAll ${heicFiles.length} HEIC files converted successfully!`);
}

convertAll().catch(err => {
  console.error('Conversion failed:', err);
  process.exit(1);
});
