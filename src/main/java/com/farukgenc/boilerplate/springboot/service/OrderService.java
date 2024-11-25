package com.farukgenc.boilerplate.springboot.service;

import com.farukgenc.boilerplate.springboot.model.Order;
import com.farukgenc.boilerplate.springboot.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    public List<Order> findAll(){
        return orderRepository.findAll();
    }

    public Order findById(Long id){
        return orderRepository.findById(id).get();
    }

    public String save(Order order){
        orderRepository.save(order);
        return "Pedido creado correctamente";
    }

    public Order update(Order order){
        return orderRepository.save(order);
    }

    public void delete(Order order){
        orderRepository.delete(order);
    }
}

