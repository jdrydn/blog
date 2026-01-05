import clsx from 'clsx';
import Image from 'next/image';

import image1 from '@/images/photos/makeshift.jpg';
import image2 from '@/images/photos/koi.png';
import image3 from '@/images/photos/whiteboard.jpeg';
import image4 from '@/images/photos/bellagio.jpeg';
import image5 from '@/images/photos/new-vegas.jpeg';

export default function HomepagePhotos() {
  const rotations = ['rotate-2', '-rotate-2', 'rotate-2', 'rotate-2', '-rotate-2']

  return (
    <div className="mt-16 sm:mt-20">
      <div className="-my-4 flex justify-center gap-5 overflow-hidden py-4 sm:gap-8">
        {[image1, image2, image3, image4, image5].map((image, imageIndex) => (
          <div
            key={image.src}
            className={clsx(
              'relative w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 sm:w-72 sm:rounded-2xl',
              rotations[imageIndex % rotations.length],
            )}
          >
            <div className="aspect-9/10">
              <Image
                src={image}
                alt=""
                width={300}
                height={300}
                sizes="(min-width: 640px) 18rem, 11rem"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
