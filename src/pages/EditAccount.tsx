import {useLocation, useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import {Account, StorageManagerContext} from "../managers/storage.tsx";
import {Color, Icon} from "../globals.tsx";
import useTelegramMainButton from "../hooks/telegram/useTelegramMainButton.ts";
import {Button, Stack, Typography} from "@mui/material";
import LottieAnimation from "../components/LottieAnimation.tsx";
import CreateAnimation from "../assets/create_lottie.json";
import TelegramTextField from "../components/TelegramTextField.tsx";
import IconPicker from "../components/IconPicker.tsx";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import useTelegramHaptics from "../hooks/telegram/useTelegramHaptics.ts";

export interface EditAccountState {
    account: Account;
}

export default function EditAccount() {
    const navigate = useNavigate();
    const location = useLocation();
    const { notificationOccurred, } = useTelegramHaptics();
    const state = location.state as EditAccountState;
    const storageManager = useContext(StorageManagerContext);

    const [issuer, setIssuer] = useState(state.account.issuer);
    const [label, setLabel] = useState(state.account.label);
    const [selectedIcon, setSelectedIcon] = useState<Icon>(state.account.icon);
    const [selectedColor, setSelectedColor] = useState<Color>(state.account.color);

    useTelegramMainButton(() => {
        storageManager?.saveAccount({
            ...state.account,
            color: selectedColor,
            icon: selectedIcon,
            issuer,
            label,
        });
        navigate("/");
        return true;
    }, "Save");

    return <Stack spacing={2} alignItems="center">
        <LottieAnimation animationData={CreateAnimation}/>
        <Typography variant="h5" fontWeight="bold" align="center">
            Pengaturan informasi akun
        </Typography>
        <Typography variant="subtitle2" align="center">
            Ubah informasi akun
        </Typography>
        <TelegramTextField
            fullWidth
            label="Label (required)"
            value={label}
            onChange={e => {
                setLabel(e.target.value);
            }}
        />
        <TelegramTextField
            fullWidth
            label="Service"
            value={issuer}
            onChange={e => {
                setIssuer(e.target.value);
            }}
        />
        <IconPicker
            setSelectedIcon={setSelectedIcon}
            selectedIcon={selectedIcon}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}/>

        <Button startIcon={<DeleteOutlinedIcon/>} color="error" onClick={() => {
            notificationOccurred("warning");
            window.Telegram.WebApp.showPopup({
                message: `Apakah Anda yakin ingin menghapus ${state.account.issuer ? 
                    `${state.account.issuer} (${state.account.label})` : 
                    state.account.label}?`,
                buttons: [
                    {type: "destructive", text: "Yes", id: "remove"},
                    {type: "cancel", id: "cancel"},
                ]
            }, (id) => {
                if (id !== "remove") return;
                storageManager?.removeAccount(state.account.id);
                navigate("/");
            });
        }}>
            Hapus akun
        </Button>
    </Stack>;
}
