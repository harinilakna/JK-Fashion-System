package com.bit.jk_fashion_system.dao;


import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bit.jk_fashion_system.entity.Product;



//create designation interface and extend into jpareporsitory<modalfile,datatype of pk>
public interface ProductDao extends JpaRepository<Product, Integer> {

    //get next item code
    @Query(value = "SELECT concat('P',lpad(substring(max(product.code),2)+1, 5, '0'))FROM er_jk_fashion.product as product; ", nativeQuery = true)
    public String getNextProductNo();


    //define query for get active items with selected coloumn
    @Query(value = "SELECT new Product(P.id, P.code, P.name, P.unit_price) From Product P where P.product_status_id.id in (1,2)")
    public List<Product>getAvailableProductListProductionOrder();

      @Query(value = "SELECT p FROM Product p where p.id in(SELECT php.product_id.id FROM ProductionOrderHasProduct php where php.production_order_id.id=?1)")
      public List<Product> getProductByporderId(Integer productionId);


       @Query(value = "SELECT p From Product p where p.product_status_id.id=1")
    public List<Product>getAvailableProduct();


    
    @Query(value = "SELECT p FROM Product p where p.id =:id ")
    Product getByProduct(@Param("id") Integer id);

    
}
