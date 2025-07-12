package com.bit.jk_fashion_system.dao;


import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.bit.jk_fashion_system.entity.Material;



//create material interface and extend into jpareporsitory<modalfile,datatype of pk>
public interface MaterialDao extends JpaRepository<Material, Integer> {

    //get next Material code
    @Query(value = "SELECT concat('M',lpad(substring(max(material.code),2)+1, 5, '0'))FROM er_jk_fashion.material as material; ", nativeQuery = true)
    public String getNextMaterialNo();

    //define query for get active items with selected coloumn
    @Query(value = "SELECT new Material(M.id, M.code, M.name, M.unit_price) From Material M where M.material_status_id.id=1 ")
    public List<Material>getAvailableMaterialList();

     //define query for get active items with selected coloumn
     @Query(value = "SELECT new Material(M.id, M.code, M.name,M.unit_price) From Material M where M.material_status_id.id=1 and M.id not in (select shi.material_id.id from SupplierHasMaterial shi where shi.supplier_id.id=?1)")
     public List<Material>getNotAvailableMaterial(Integer supplierid);

     @Query(value="select m from Material m where m.material_status_id.id=1 and m.id in (select shm.material_id.id from SupplierHasMaterial shm where shm.supplier_id.id=?1)")
     public List<Material> getBySupplier(Integer supplierid);


    //  @Query(value="select m from Material m where m.material_status_id.id=1 and m.id in (select qhm.material_id.id from QuotationHasMaterial qhm where qhm.quotation_id.id=?1)")
    //  public List<Material> getByQuotationId(Integer quotationid);

     @Query(value="select m from Material m where m.material_status_id.id=1 and m.id in (select porder.material_id.id from PurchaseOrderHasMaterial porder where porder.purchase_order_id.id=?1)")
     public List<Material> getByporderId(Integer porderid);


    @Query(value = "SELECT m from Material m where m.id=?1")
     Material getMaterialStockByMaterial(Integer materialId);

}
