// src/components/home/ProductCarousel.jsx

import useEmblaCarousel from 'embla-carousel-react';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

const ProductCarousel = ({ title, products }) => {
    const [emblaRef] = useEmblaCarousel({
        align: 'start',
        containScroll: 'trimSnaps',
        dragFree: true,
    });

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <motion.section 
            className="py-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-3xl md:text-4xl font-bold mb-8">{title}</h2>
            <div className="overflow-hidden -mx-4" ref={emblaRef}>
                <div className="flex">
                    {products.map(product => (
                        <div key={product.id} className="flex-shrink-0 flex-grow-0 basis-[70%] sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 px-4">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

export default ProductCarousel;