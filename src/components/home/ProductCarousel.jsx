// src/components/home/ProductCarousel.jsx

import useEmblaCarousel from 'embla-carousel-react';
// --- THIS IS THE FIX: Step 1 ---
import WheelGestures from 'embla-carousel-wheel-gestures'; // Import the plugin
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

const ProductCarousel = ({ title, products }) => {
    // --- THIS IS THE FIX: Step 2 ---
    // We add the plugin to the useEmblaCarousel hook
    const [emblaRef] = useEmblaCarousel(
        {
            align: 'start',
            containScroll: 'trimSnaps',
            dragFree: true,
        },
        [WheelGestures()] // Activate the wheel gestures plugin here
    );
    // --- END OF FIX ---

    if (!products || products.length === 0) {
        return null;
    }

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <motion.section 
            className="py-12"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            <h2 className="text-3xl md:text-4xl font-bold mb-8">{title}</h2>
            <div className="overflow-hidden -mx-4" ref={emblaRef}>
                <div className="flex">
                    {products.map(product => (
                        <div key={product.id} className="flex-shrink-0 flex-grow-0 basis-[70%] sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 px-4">
                            <ProductCard product={product} disableAnimation={true} />
                        </div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

export default ProductCarousel;