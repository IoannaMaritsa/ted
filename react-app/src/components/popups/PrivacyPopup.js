import React, {useState} from 'react';
import "../../css/popup.css";

const PrivacyModal = ({ isOpen, onClose, onChangePrivacySetting, currentPrivacy }) => {
    const [selectedPrivacy, setSelectedPrivacy] = useState(currentPrivacy);
    if (!isOpen) return null;


    // Handle radio button change
    const handlePrivacyChange = (event) => {
        setSelectedPrivacy(event.target.value);
    };

    // Handle save button click
    const handleSave = () => {
        onChangePrivacySetting(selectedPrivacy);
    };

    return (<div className="privacy-modal">
        <div className="privacy-modal-content">
            <div className="privacy-modal-header">
                <div className="privacy-modal-title">Επεξεργασία Ιδιωτικότητας</div>
                <img className="privacy-modal-close-btn" alt="Close" src="close-icon.png" onClick={onClose}>
                </img>
            </div>

            <div className="privacy-row">
                <div class="icon-circle">
                    <img className="privacy-row-icon" src="/planet.png" alt="Public" />
                </div>
                <div className="privacy-row-text">
                    <span className="privacy-text-title ">Δημόσιο</span>
                    <span className="privacy-text-subtitle">Ορατό σε οποιονδήποτε</span>
                </div>
                <input type="radio" name="privacy" onChange={handlePrivacyChange} checked={selectedPrivacy === 'public'} value="public" className="privacy-row-radio" />
            </div>
            <div className="privacy-row">
                <div class="icon-circle">
                    <img className="privacy-row-icon" src="/friends.png" alt="Friends" />
                </div>
                <div className="privacy-row-text">
                    <span className="privacy-text-title ">Συνδέσεις</span>
                    <span className="privacy-text-subtitle">Ορατό στις συνδέσεις σας</span>
                </div>
                <input type="radio" name="privacy" onChange={handlePrivacyChange}  checked={selectedPrivacy === 'friends'}value="friends" className="privacy-row-radio" />
            </div>
            <div className="privacy-row2">
                <div class="icon-circle">
                    <img className="privacy-row-icon" src="/private.png" alt="Private" />
                </div>
                <div className="privacy-row-text">
                    <span className="privacy-text-title ">Ιδιωτικό</span>
                    <span className="privacy-text-subtitle">Ορατό μόνο σε εσάς</span>
                </div>
                <input type="radio" name="privacy" onChange={handlePrivacyChange} checked={selectedPrivacy === 'private'}  value="private" className="privacy-row-radio" />
            </div>
            <div className="privacy-modal-footer">
                <button className="privacy-modal-button"  onClick={handleSave}> Αποθήκευση</button>
            </div>
        </div>
    </div>);
}

export default PrivacyModal;