import React, { useEffect, useState } from 'react';
import styles from '../styles/form.module.css';
import Modal from './Modal';

interface FormProps {
  selectedSeats: number[];
  pricePerSeat: number;
}

type FormData = {
  seat: number;
  name: string;
  surname: string;
  phone: string;
  email: string;
  gender: "Male" | "Female" | "";
  dob: string;
};

const Form: React.FC<FormProps> = ({ selectedSeats, pricePerSeat }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState({ title: '', message: '', status: 'success' as 'success' | 'error' | 'warning' });

  const [formData, setFormData] = useState<FormData[]>(
    selectedSeats.map((seat: number) => ({
      seat,
      name: '',
      surname: '',
      phone: '',
      email: '',
      gender: '',
      dob: '',
    }))
  );
  const [errors, setErrors] = useState<{ [key: number]: { [field: string]: string } }>({});
  const [expandedForms, setExpandedForms] = useState<{ [key: number]: boolean }>(
    Object.fromEntries(selectedSeats.map((seat) => [seat, false]))
  );

  const handleToggle = (seat: number) => {
    setExpandedForms((prev) => ({
      ...prev,
      [seat]: !prev[seat],
    }));
  };
  // Form verilerini güncelleme
  const handleChange = <K extends keyof typeof formData[0]>(
    index: number,
    field: K,
    value: typeof formData[0][K]
  ) => {
    const updatedData = [...formData];
    updatedData[index][field] = value;
    setFormData(updatedData);
  };

  // Detaylı doğrulama
  const validateForm = () => {
    const newErrors: { [key: number]: { [field: string]: string } } = {};

    formData.forEach((data, index) => {
      const seatErrors: { [field: string]: string } = {};
      if (!data.name.trim()) seatErrors.name = 'İsim boş olamaz.';
      if (!data.name || !/^[a-zA-ZğüşöçıİĞÜŞÖÇ\s]+$/.test(data.name)) {
        seatErrors.name = 'İsim yalnızca harf ve boşluk içerebilir.';
      }
      if (!data.surname.trim()) seatErrors.surname = 'Soyisim boş olamaz.';
      if (!data.surname || !/^[a-zA-ZğüşöçıİĞÜŞÖÇ\s]+$/.test(data.surname)) {
        seatErrors.surname = 'Soyisim yalnızca harf ve boşluk içerebilir.';
      }
      if (!data.phone || !/^[0-9]{10}$/.test(data.phone)) {
        seatErrors.phone = 'Telefon numarası 10 haneli ve yalnızca rakam olmalıdır.';
      }
      if (
        !data.email ||
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email)
      ) {
        seatErrors.email = 'Geçerli bir e-posta adresi giriniz.';
      }
      if (!data.gender) seatErrors.gender = 'Cinsiyet seçimi zorunludur.';
      if (!data.dob) seatErrors.dob = 'Doğum tarihi boş olamaz.';
      if (data.dob) {
        const dob = new Date(data.dob);
        const today = new Date();
        if (dob >= today) seatErrors.dob = 'Doğum tarihi bugünden önce olmalıdır.';
        //max 100 years old
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() - 150);
        if (dob < maxDate) seatErrors.dob = 'Doğum tarihi en fazla 150 yıl önce olmalıdır.';
      }

      if (Object.keys(seatErrors).length > 0) {
        newErrors[index] = seatErrors;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Hata yoksa true döner
  };

  // Form gönderimi
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeats.length) {
      setModalMessage({
        title: 'Hata',
        message: 'Lütfen en az bir koltuk seçiniz.',
        status: 'error',
      });
      setIsModalOpen(true);
      return;
    }
    if (validateForm()) {
      console.log('Gönderilen Veriler:', formData);
      setModalMessage({
        title: 'Başarılı',
        message: 'Form başarıyla gönderildi!',
        status: 'success',
      });
      setIsModalOpen(true);
    } else {
      setModalMessage({
        title: 'Hata',
        message: 'Lütfen formu eksiksiz ve doğru bir şekilde doldurunuz.',
        status: 'error',
      });
      setIsModalOpen(true);
      setExpandedForms(
        Object.fromEntries(selectedSeats.map((seat) => [seat, true]))
      );
    }
  };

  useEffect(() => {
    //if selection seats change, update form data if not change seat protect form data

    setFormData(
      selectedSeats.map((seat) => ({
        seat,
        name: '',
        surname: '',
        phone: '',
        email: '',
        gender: '',
        dob: '',
      }))
    );
  }, [selectedSeats]);



  return (
    <div className={styles.form}>
      <form onSubmit={handleSubmit}>
      {formData.map((data, index) => (
          <div key={data.seat} className={styles.passengerContainer}>
            <div
              className={styles.passengerHeader}
              onClick={() => handleToggle(data.seat)}
            >
              <span>{index + 1}. Yolcu (Koltuk: {data.seat})</span>
              <span>{expandedForms[data.seat] ? '▼' : '▶'}</span>
            </div>
            {expandedForms[data.seat] && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="İsim"
                    value={data.name}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                    className={`${styles.input} ${errors[index]?.name ? styles.errorInput : ''}`}
                  />
                  {errors[index]?.name && <span className={styles.errorText}>{errors[index].name}</span>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Soyisim"
                    value={data.surname}
                    onChange={(e) => handleChange(index, 'surname', e.target.value)}
                    className={`${styles.input} ${errors[index]?.surname ? styles.errorInput : ''}`}
                  />
                  {errors[index]?.surname && (
                    <span className={styles.errorText}>{errors[index].surname}</span>
                  )}
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Telefon (10 haneli)"
                    value={data.phone}
                    onChange={(e) => handleChange(index, 'phone', e.target.value)}
                    className={`${styles.input} ${errors[index]?.phone ? styles.errorInput : ''}`}
                  />
                  {errors[index]?.phone && (
                    <span className={styles.errorText}>{errors[index].phone}</span>
                  )}
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="E-Posta"
                    value={data.email}
                    onChange={(e) => handleChange(index, 'email', e.target.value)}
                    className={`${styles.input} ${errors[index]?.email ? styles.errorInput : ''}`}
                  />
                  {errors[index]?.email && (
                    <span className={styles.errorText}>{errors[index].email}</span>
                  )}
                </div>
                <div>
                  <select
                    value={data.gender}
                    onChange={(e) => handleChange(index, 'gender', e.target.value as "Male" | "Female" | "")}
                    className={`${styles.select} ${errors[index]?.gender ? styles.errorInput : ''}`}
                  >
                    <option value="">Cinsiyet</option>
                    <option value="Male">Erkek</option>
                    <option value="Female">Kadın</option>
                  </select>
                  {errors[index]?.gender && (
                    <span className={styles.errorText}>{errors[index].gender}</span>
                  )}
                </div>
                <div>
                  <input
                    type="date"
                    value={data.dob}
                    onChange={(e) => handleChange(index, 'dob', e.target.value)}
                    className={`${styles.input} ${errors[index]?.dob ? styles.errorInput : ''}`}
                  />
                  {errors[index]?.dob && (
                    <span className={styles.errorText}>{errors[index].dob}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        <button type="submit" className={styles.submitButton}>
          İşlemleri Tamamla
        </button>
      </form>
      {/* Modal Bileşeni */}
      <Modal
        isOpen={isModalOpen}
        title={modalMessage.title}
        message={modalMessage.message}
        status={modalMessage.status}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Form;
