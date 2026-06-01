# Voice Recognition Service

import io
import librosa
import numpy as np

from resemblyzer import (
    VoiceEncoder,
    preprocess_wav
)


# --------------------------------------------------
# Load Encoder Once
# --------------------------------------------------

encoder = VoiceEncoder()


# --------------------------------------------------
# Generate Voice Embedding
# Input:
#   Audio Bytes
#
# Output:
#   Voice Vector
# --------------------------------------------------

def get_voice_embedding(audio_bytes):

    audio, sr = librosa.load(
        io.BytesIO(audio_bytes),
        sr=16000
    )

    wav = preprocess_wav(audio)

    embedding = encoder.embed_utterance(
        wav
    )

    return list(embedding)


# --------------------------------------------------
# Identify Single Speaker
# --------------------------------------------------

def identify_speaker(
        new_embedding,
        candidates_dict,
        threshold=0.65
):

    best_sid = None

    best_score = -1

    for sid, stored_embedding in candidates_dict.items():

        similarity = np.dot(
            new_embedding,
            stored_embedding
        )

        if similarity > best_score:

            best_score = similarity

            best_sid = sid

    if best_score >= threshold:

        return best_sid, best_score

    return None, best_score


# --------------------------------------------------
# Bulk Audio Processing
# Classroom Audio
# --------------------------------------------------

def process_bulk_audio(
        audio_bytes,
        candidates_dict,
        threshold=0.65
):

    audio, sr = librosa.load(
        io.BytesIO(audio_bytes),
        sr=16000
    )

    segments = librosa.effects.split(
        audio,
        top_db=30
    )

    identified_results = {}

    for start, end in segments:

        if (end - start) < sr * 0.5:
            continue

        segment_audio = audio[start:end]

        wav = preprocess_wav(
            segment_audio
        )

        embedding = encoder.embed_utterance(
            wav
        )

        sid, score = identify_speaker(
            embedding,
            candidates_dict,
            threshold
        )

        if sid:

            if (
                sid not in identified_results
                or score >
                identified_results[sid]
            ):

                identified_results[sid] = score

    return identified_results