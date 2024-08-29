"use client"

import useRentModal from "@/app/hooks/useRentModal"
import Modal from "./Modal";
import { useMemo, useState } from "react";
import Heading from "../Heading";

enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGE = 3,
    DESCRIPTION = 4,
    PRICE = 5,
}

const RentalModal = () => {
    const rentModal = useRentModal();
    const [step, setStep] = useState(STEPS.CATEGORY);

    const onBack = () => {
        setStep((value) => value - 1);
    }

    const onNext = () => {
        setStep((value) => value + 1);
    }

    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) {
            return 'Create';
        }
        return 'Next';
    }, [step]);

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.CATEGORY) {
            return undefined;
        }
        return 'Back';
    }, [step]);

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading
            title="which of these best describes your place?"
            subtitle="Pick a category"
        />    
        <div className="grid grid"></div>

        </div>
    );

    return (
        <Modal
            isOpen={rentModal.isOpen}
            onClose={rentModal.onClose}
            onSubmit={onNext}
            actionLabel={actionLabel}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
            title="FunInRwanda, memories of tomorrow!"
            body={bodyContent}
        />
    );
}

export default RentalModal;