package  com.bit.jk_fashion_system.dao;


import com.bit.jk_fashion_system.entity.PaymentStatus;


import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentStatusDao extends JpaRepository<PaymentStatus,Integer> {
}
