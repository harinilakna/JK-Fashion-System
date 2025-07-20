package com.bit.jk_fashion_system.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bit.jk_fashion_system.entity.DailyProduction;


public interface DailyProductionDao extends JpaRepository<DailyProduction, Integer> {
}
