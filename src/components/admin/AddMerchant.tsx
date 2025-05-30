import React, { useState } from 'react';
// import { useContract } from 'path-to-your-contract-hook'; // Adjust the import based on your setup

const AddMerchantModal = () => {
  const [merchantAddress, setMerchantAddress] = useState('');
//   const { addMerchant } = useContract(); // Assuming you have a hook to interact with the contract

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
    //   await addMerchant(merchantAddress);
    //   onClose();
    } catch (error) {
      console.error('Error adding merchant:', error);
    }
  };

//   if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Merchant</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Merchant Address:
            <input
              type="text"
              value={merchantAddress}
              onChange={(e) => setMerchantAddress(e.target.value)}
              required
            />
          </label>
          <button type="submit">Add Merchant</button>
          {/* <button type="button" onClick={onClose}>Cancel</button> */}
        </form>
      </div>
    </div>
  );
};

export default AddMerchantModal;