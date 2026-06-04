# Voice Recognition Service
import tempfile
from pydub import AudioSegment
from pydub.utils import get_prober_name
import os
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
from pydub.utils import get_prober_name
AudioSegment.converter = (
    r"C:\Users\Soumyadeep Ghosh\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin\ffmpeg.exe"
)
import os
os.environ["FFMPEG_BINARY"] = (
    r"C:\Users\Soumyadeep Ghosh\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin\ffmpeg.exe"
)

# print("FFmpeg:", AudioSegment.converter)
# print("Prober:", get_prober_name())


def get_voice_embedding(
    audio_bytes: bytes,
    filename: str | None = None
):
    temp_path = None
    wav_path = None
    try:
        ext = ".webm"
        if filename and "." in filename:
            ext = "." + filename.rsplit(".", 1)[-1].lower()

        with tempfile.NamedTemporaryFile(
            suffix=ext,
            delete=False
        ) as f:
            f.write(audio_bytes)
            temp_path = f.name
        print("Input File:", temp_path)
        wav_path = temp_path + ".wav"

        # print("FFmpeg:", AudioSegment.converter)
        # print("FFprobe:", AudioSegment.ffprobe)
        # print("Input File:", temp_path)

        AudioSegment.from_file(
            temp_path
        ).export(
            wav_path,
            format="wav"
        )
        print("Converted WAV:", wav_path)

        wav = preprocess_wav(wav_path)
        if wav is None or len(wav) == 0:
            raise ValueError(
                "No usable speech after preprocessing"
            )
        embedding = encoder.embed_utterance(wav)
        return list(embedding)
    except Exception as e:
        import traceback
        print(
            "Voice Processing Error:",
            repr(e)
        )
        traceback.print_exc()
        return None
    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)

        if wav_path and os.path.exists(wav_path):
            os.remove(wav_path)

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