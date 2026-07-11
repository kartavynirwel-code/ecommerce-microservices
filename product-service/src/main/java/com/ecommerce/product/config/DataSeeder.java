package com.ecommerce.product.config;

import com.ecommerce.product.model.Product;
import com.ecommerce.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) {
            return;
        }

        productRepository.save(Product.builder()
                .name("Leather Messenger Bag")
                .description("Handcrafted full-grain leather bag with brass fittings.")
                .price(new BigDecimal("89.99"))
                .stock(25)
                .category("Bags")
                .imageUrl("https://images.unsplash.com/photo-1548036328-c9fa89d128fa")
                .build());

        productRepository.save(Product.builder()
                .name("Wireless Noise-Cancelling Headphones")
                .description("Over-ear headphones with 30-hour battery life.")
                .price(new BigDecimal("149.99"))
                .stock(40)
                .category("Electronics")
                .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e")
                .build());

        productRepository.save(Product.builder()
                .name("Espresso Machine")
                .description("15-bar pump espresso machine with milk frother.")
                .price(new BigDecimal("219.00"))
                .stock(15)
                .category("Home")
                .imageUrl("https://images.unsplash.com/photo-1517705008128-361805f42e86")
                .build());

        productRepository.save(Product.builder()
                .name("Suede Chelsea Boots")
                .description("Classic tan suede Chelsea boots with elastic side panels.")
                .price(new BigDecimal("129.50"))
                .stock(30)
                .category("Footwear")
                .imageUrl("https://images.unsplash.com/photo-1520639888713-7851133b1ed0")
                .build());

        productRepository.save(Product.builder()
                .name("Mechanical Keyboard")
                .description("Hot-swappable mechanical keyboard with brown switches.")
                .price(new BigDecimal("99.00"))
                .stock(50)
                .category("Electronics")
                .imageUrl("https://images.unsplash.com/photo-1587829741301-dc798b83add3")
                .build());

        productRepository.save(Product.builder()
                .name("Ceramic Coffee Mug Set")
                .description("Set of 4 handmade ceramic mugs, earth-tone glaze.")
                .price(new BigDecimal("34.99"))
                .stock(60)
                .category("Home")
                .imageUrl("https://images.unsplash.com/photo-1517142089942-ba376ce32a2e")
                .build());
    }
}
