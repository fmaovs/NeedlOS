package com.farukgenc.boilerplate.springboot.service;

import com.farukgenc.boilerplate.springboot.model.Customer;
import com.farukgenc.boilerplate.springboot.repository.CustomerRepository;
import com.farukgenc.boilerplate.springboot.security.dto.CustomerDTO;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository customerRepository;

    public List<Customer> findAll() {
        return customerRepository.findAll();
    }
    public Optional<Customer> findById(Long id) {
        return customerRepository.findById(id);
    }
    public Optional<Customer> buscarPorTelefono(Long phone) {
        return customerRepository.findByPhone(phone);
    }

    @Transactional
    public String save(CustomerDTO customer) {
        Customer newCustomer = new Customer();
        BeanUtils.copyProperties(customer, newCustomer);
        newCustomer.setFecha_registro(new Date());
        customerRepository.save(newCustomer);
        return "Operación exitosa";
    }
    @Transactional
    public Customer update(Long  id, CustomerDTO updatedCustomer){
        return customerRepository.findById(id).map(existingCustomer -> {
            if (updatedCustomer.getName() != null ){
                existingCustomer.setName(updatedCustomer.getName());
            }
            if (updatedCustomer.getLastname() != null) {
                existingCustomer.setLastname(updatedCustomer.getLastname());
            }
            if (updatedCustomer.getPhone() != null) {
                existingCustomer.setPhone(updatedCustomer.getPhone());
            }
            return customerRepository.save(existingCustomer);
        }).orElseThrow(()-> new RuntimeException("customer not found  with id"  + id ));

    }

    @Transactional
    public void delete(Customer customer) {
        customerRepository.delete(customer);
    }

}
