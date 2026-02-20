import React, { useState, useEffect } from 'react';
import { db, storage } from '../config/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import styles from './styles/Admin.module.scss';

export default function Admin() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingEvent, setEditingEvent] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [isAdminAuth, setIsAdminAuth] = useState(false);

    // Senha mestre simples para a área admin (depois você pode mudar)
    const MASTER_PASSWORD = 'admin';

    useEffect(() => {
        if (isAdminAuth) {
            fetchEvents();
        }
    }, [isAdminAuth]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "eventos"), orderBy("titulo"));
            const querySnapshot = await getDocs(q);
            const docs = [];
            querySnapshot.forEach((doc) => {
                docs.push({ id: doc.id, ...doc.data() });
            });
            setEvents(docs);
        } catch (error) {
            console.error("Erro ao buscar eventos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdminLogin = (e) => {
        e.preventDefault();
        if (password === MASTER_PASSWORD) {
            setIsAdminAuth(true);
        } else {
            alert('Senha incorreta');
        }
    };

    if (!isAdminAuth) {
        return (
            <div className={styles.adminLogin}>
                <div className={styles.loginBox}>
                    <h1>Área Administrativa</h1>
                    <form onSubmit={handleAdminLogin}>
                        <input
                            type="password"
                            placeholder="Senha Mestre"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit">Entrar</button>
                    </form>
                    <a href="/" className={styles.backLink}>Voltar para o site</a>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.adminContainer}>
            <header className={styles.header}>
                <h1>Meus DVDs Digitais</h1>
                <button className={styles.newBtn} onClick={() => { setEditingEvent(null); setIsFormOpen(true); }}>
                    + Novo Evento
                </button>
            </header>

            {loading ? (
                <p>Carregando eventos...</p>
            ) : (
                <div className={styles.eventGrid}>
                    {events.map((event) => (
                        <div key={event.id} className={styles.eventCard}>
                            <div className={styles.cardInfo}>
                                <h3>{event.titulo}</h3>
                                <p>{event.subtitulo}</p>
                                <code>/{event.id}</code>
                            </div>
                            <div className={styles.cardActions}>
                                <button onClick={() => { setEditingEvent(event); setIsFormOpen(true); }}>Editar</button>
                                <button onClick={() => handleClone(event)}>Clonar</button>
                                <button className={styles.deleteBtn} onClick={() => handleDelete(event.id)}>Excluir</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isFormOpen && (
                <AdminForm
                    event={editingEvent}
                    onClose={() => setIsFormOpen(false)}
                    onSave={() => { setIsFormOpen(false); fetchEvents(); }}
                />
            )}
        </div>
    );

    async function handleDelete(id) {
        if (window.confirm('Tem certeza que deseja excluir este evento?')) {
            await deleteDoc(doc(db, "eventos", id));
            fetchEvents();
        }
    }

    async function handleClone(event) {
        const { id, ...data } = event;
        setEditingEvent({ ...data, _isClone: true, _oldId: id });
        setIsFormOpen(true);
    }
}

function AdminForm({ event, onClose, onSave }) {
    const isEditing = !!event && !event._isClone;

    const [formData, setFormData] = useState(event || {
        titulo: '',
        subtitulo: '',
        senha: '',
        backgrounds: { home: '', login: '', capitulos: '', extras: '' },
        filmePrincipal: { url: '', provider: 'vimeo' },
        capitulos: [],
        extras: [],
        phone: '',
        companyUrl: '',
        companyName: '',
        instagramUrl: ''
    });

    const [newSlug, setNewSlug] = useState(
        event?._isClone ? `${event._oldId}-copia` : (event?.id || '')
    );

    // Estados de loading individuais para cada upload
    const [uploadingMap, setUploadingMap] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newSlug) return alert('O link (slug) é obrigatório');

        const cleanSlug = newSlug.toLowerCase().trim().replace(/\s+/g, '-');
        const oldSlug = event?.id;

        try {
            // Remove campos auxiliares antes de salvar
            const dataToSave = { ...formData };
            delete dataToSave._isClone;
            delete dataToSave._oldId;
            delete dataToSave.id;

            // Se o slug mudou e estávamos editando, precisamos apagar o antigo
            if (isEditing && oldSlug !== cleanSlug) {
                if (window.confirm(`Você está alterando o link de "/${oldSlug}" para "/${cleanSlug}". O link antigo deixará de funcionar. Confirmar?`)) {
                    await setDoc(doc(db, "eventos", cleanSlug), dataToSave);
                    await deleteDoc(doc(db, "eventos", oldSlug));
                } else {
                    return; // Cancela a operação
                }
            } else {
                await setDoc(doc(db, "eventos", cleanSlug), dataToSave);
            }

            onSave();
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert('Erro ao salvar: ' + error.message);
        }
    };

    const handleFileUpload = async (e, path) => {
        const file = e.target.files[0];
        if (!file) return;

        console.log(`[Upload] Iniciando processo para: ${path}`, file.name);
        setUploadingMap(prev => ({ ...prev, [path]: true }));

        try {
            const slugPath = newSlug || 'temp';
            console.log(`[Upload] Bucket Path: backgrounds/${slugPath}/${file.name}`);

            const storageRef = ref(storage, `backgrounds/${slugPath}/${file.name}`);

            console.log(`[Upload] Enviando bytes...`);
            const snapshot = await uploadBytes(storageRef, file);

            console.log(`[Upload] Bytes enviados! Gerando URL de download...`);
            const url = await getDownloadURL(snapshot.ref);

            console.log("[Upload] Sucesso total! URL:", url);

            setFormData(prev => ({
                ...prev,
                backgrounds: {
                    ...prev.backgrounds,
                    [path]: url
                }
            }));
        } catch (error) {
            console.error("[Upload] ERRO DETALHADO:", error);
            alert(`Erro ao subir imagem: ${error.message}\n\n⚠️ Verifique se o 'Storage' foi ativado no Console do Firebase e se as Regras estão em 'Modo de Teste'.`);
        } finally {
            console.log(`[Upload] Finalizando estado de carregamento para: ${path}`);
            setUploadingMap(prev => ({ ...prev, [path]: false }));
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>{isEditing ? 'Editar Evento' : (event?._isClone ? 'Clonar Evento' : 'Novo Evento')}</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Link do site (slug):</label>
                        <input
                            type="text"
                            value={newSlug}
                            onChange={(e) => setNewSlug(e.target.value)}
                            placeholder="ex: joao-e-maria"
                        />
                        <small style={{ color: '#888', marginTop: '4px' }}>
                            Dica: Este é o final do link. Ex: vercel.app/<strong>{newSlug || 'casal'}</strong>
                        </small>
                    </div>

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>Título:</label>
                            <input type="text" value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Subtítulo:</label>
                            <input type="text" value={formData.subtitulo} onChange={e => setFormData({ ...formData, subtitulo: e.target.value })} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Senha de Acesso:</label>
                            <input type="text" value={formData.senha} onChange={e => setFormData({ ...formData, senha: e.target.value })} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Telefone de Contato:</label>
                            <input
                                type="text"
                                value={formData.phone || ''}
                                onChange={e => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 11);
                                    setFormData({ ...formData, phone: val });
                                }}
                                placeholder="(11) 9-9999-9999"
                                maxLength={11}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Site da Empresa (URL):</label>
                            <input
                                type="text"
                                value={formData.companyUrl || ''}
                                onChange={e => setFormData({ ...formData, companyUrl: e.target.value })}
                                placeholder="https://suaempresa.com"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Nome da Empresa (no Footer):</label>
                            <input
                                type="text"
                                value={formData.companyName || ''}
                                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                                placeholder="Nome Fantasia"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Instagram da Empresa (Link):</label>
                            <input
                                type="text"
                                value={formData.instagramUrl || ''}
                                onChange={e => setFormData({ ...formData, instagramUrl: e.target.value })}
                                placeholder="https://instagram.com/suaempresa"
                            />
                        </div>
                    </div>

                    <h3>Vídeo Principal</h3>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>URL Vídeo:</label>
                            <input type="text" value={formData.filmePrincipal.url} onChange={e => setFormData({ ...formData, filmePrincipal: { ...formData.filmePrincipal, url: e.target.value } })} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Provedor:</label>
                            <select value={formData.filmePrincipal.provider} onChange={e => setFormData({ ...formData, filmePrincipal: { ...formData.filmePrincipal, provider: e.target.value } })}>
                                <option value="vimeo">Vimeo</option>
                                <option value="youtube">YouTube</option>
                            </select>
                        </div>
                    </div>

                    <h3>Imagens de Fundo (Upload ou Link Direto)</h3>
                    <div className={styles.imageUploads}>
                        {['home', 'login', 'capitulos', 'extras'].map(bg => (
                            <div key={bg} className={styles.uploadBox}>
                                <label>{bg.toUpperCase()}</label>

                                {/* Opção de Upload */}
                                <input type="file" onChange={e => handleFileUpload(e, bg)} accept="image/*" />

                                {/* Opção de Link Direto (Fallback) */}
                                <input
                                    type="text"
                                    placeholder="Ou cole o link da imagem aqui..."
                                    value={formData.backgrounds[bg] || ''}
                                    onChange={e => setFormData({
                                        ...formData,
                                        backgrounds: { ...formData.backgrounds, [bg]: e.target.value }
                                    })}
                                    className={styles.urlInput}
                                />

                                {uploadingMap[bg] && <div className={styles.miniLoader}>Enviando...</div>}
                                {formData.backgrounds[bg] && !uploadingMap[bg] && (
                                    <div className={styles.uploadSuccess}>
                                        <span className={styles.check}>✓</span>
                                        <a href={formData.backgrounds[bg]} target="_blank" rel="noreferrer">Ver Foto</a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <h3>Capítulos</h3>
                    <div className={styles.listSection}>
                        {formData.capitulos.map((cap, index) => (
                            <div key={index} className={styles.listItem}>
                                <input type="text" placeholder="Nome" value={cap.label} onChange={e => {
                                    const newCaps = [...formData.capitulos];
                                    newCaps[index].label = e.target.value;
                                    setFormData({ ...formData, capitulos: newCaps });
                                }} />
                                <input type="number" placeholder="Segundos" value={cap.start} onChange={e => {
                                    const newCaps = [...formData.capitulos];
                                    newCaps[index].start = parseInt(e.target.value);
                                    setFormData({ ...formData, capitulos: newCaps });
                                }} />
                                <button type="button" className={styles.removeBtn} onClick={() => {
                                    const newCaps = formData.capitulos.filter((_, i) => i !== index);
                                    setFormData({ ...formData, capitulos: newCaps });
                                }}>X</button>
                            </div>
                        ))}
                        <button type="button" className={styles.addBtn} onClick={() => setFormData({ ...formData, capitulos: [...formData.capitulos, { label: '', start: 0 }] })}>
                            + Adicionar Capítulo
                        </button>
                    </div>

                    <h3>Extras</h3>
                    <div className={styles.listSection}>
                        {formData.extras.map((ext, index) => (
                            <div key={index} className={styles.listItem}>
                                <input type="text" placeholder="Título" value={ext.label} onChange={e => {
                                    const newExtras = [...formData.extras];
                                    newExtras[index].label = e.target.value;
                                    setFormData({ ...formData, extras: newExtras });
                                }} />
                                <input type="text" placeholder="URL Vídeo" value={ext.url} onChange={e => {
                                    const newExtras = [...formData.extras];
                                    newExtras[index].url = e.target.value;
                                    setFormData({ ...formData, extras: newExtras });
                                }} />
                                <select value={ext.provider || 'vimeo'} onChange={e => {
                                    const newExtras = [...formData.extras];
                                    newExtras[index].provider = e.target.value;
                                    setFormData({ ...formData, extras: newExtras });
                                }}>
                                    <option value="vimeo">Vimeo</option>
                                    <option value="youtube">YouTube</option>
                                </select>
                                <button type="button" className={styles.removeBtn} onClick={() => {
                                    const newExtras = formData.extras.filter((_, i) => i !== index);
                                    setFormData({ ...formData, extras: newExtras });
                                }}>X</button>
                            </div>
                        ))}
                        <button type="button" className={styles.addBtn} onClick={() => setFormData({ ...formData, extras: [...formData.extras, { label: '', url: '', provider: 'vimeo' }] })}>
                            + Adicionar Extra
                        </button>
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancelar</button>
                        <button type="submit" className={styles.saveBtn}>Salvar Evento</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
