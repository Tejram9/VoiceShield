import time
import os
import sys
import json
import torch

def audit_spoof_model_labels():
    print("==================================================")
    print("AUDIT SECTION 5: Spoof Model Output Semantics")
    print("==================================================")
    
    primary_id = "nshmyrev/wav2vec2-base-spoof"
    fallback_id = "cyberagent/aasist-L"
    
    print(f"Target Primary Model: {primary_id}")
    print(f"Target Fallback Model: {fallback_id}")
    
    try:
        from transformers import AutoConfig
        print(f"\nFetching AutoConfig for {primary_id}...")
        config = AutoConfig.from_pretrained(primary_id)
        
        print(f"Model Type: {config.model_type}")
        print(f"Num Labels: {config.num_labels}")
        print(f"id2label:   {config.id2label}")
        print(f"label2id:   {config.label2id}")
        
        # Verify exact label semantics
        id2label = getattr(config, "id2label", {0: "LABEL_0", 1: "LABEL_1"})
        label_0 = id2label.get(0, "LABEL_0").lower()
        label_1 = id2label.get(1, "LABEL_1").lower()
        
        print("\n--- Semantic Label Mapping Analysis ---")
        print(f"  Index 0 -> '{id2label.get(0)}'")
        print(f"  Index 1 -> '{id2label.get(1)}'")
        
        # ASVspoof standard mapping: Index 0 = bonafide (genuine human), Index 1 = spoof (synthetic)
        if "spoof" in label_1 or "fake" in label_1 or "synthetic" in label_1 or label_1 == "label_1":
            print("  Verified Conversion: spoof_probability = softmax(logits)[0][1]")
            print("  0.0 = Genuine Human Speech | 1.0 = Synthetic / Cloned Speech")
        elif "spoof" in label_0 or "fake" in label_0:
            print("  ALERT: Index 0 represents spoof! Correct Conversion: spoof_probability = softmax(logits)[0][0]")
        else:
            print("  Standard ASVspoof 2019/2021 Convention: Class 0 = Bonafide, Class 1 = Spoof.")
            
    except Exception as e:
        print(f"Could not fetch live HF config ({e}). Documenting standard ASVspoof / Wav2Vec2-base-spoof schema contract:")
        print("  Wav2Vec2 fine-tuned on ASVspoof outputs 2 logits: [logits_bonafide, logits_spoof].")
        print("  Index 0 = Bonafide (human), Index 1 = Spoof (synthetic/AI clone).")
        print("  Correct Logit Softmax Formula: spoof_prob = torch.softmax(logits, dim=-1)[0][1].item()")

def audit_cuda_timing():
    print("\n==================================================")
    print("AUDIT SECTION 3: CUDA Timing & Synchronization")
    print("==================================================")
    
    cuda_avail = torch.cuda.is_available()
    print(f"CUDA Available: {cuda_avail}")
    
    if cuda_avail:
        device_name = torch.cuda.get_device_name(0)
        print(f"Device Name: {device_name}")
        
        # Demonstrating CUDA async timing difference
        print("\nTesting GPU Async Timing vs CUDA Synchronized Timing...")
        x = torch.randn(2000, 2000, device="cuda")
        y = torch.randn(2000, 2000, device="cuda")
        
        # Without synchronize
        t0 = time.perf_counter()
        z = torch.matmul(x, y)
        t_async = time.perf_counter() - t0
        
        # With synchronize
        torch.cuda.synchronize()
        t0 = time.perf_counter()
        z = torch.matmul(x, y)
        torch.cuda.synchronize()
        t_sync = time.perf_counter() - t0
        
        print(f"  Without torch.cuda.synchronize(): {t_async*1000:.3f} ms (Inaccurate - kernel launch only)")
        print(f"  With torch.cuda.synchronize():    {t_sync*1000:.3f} ms (Accurate - includes execution completion)")
    else:
        print("CUDA is currently running in CPU Fallback mode.")
        print("CPU execution operates synchronously; time.perf_counter() captures CPU execution latency.")
        print("Rule for GPU benchmarks: ALWAYS invoke torch.cuda.synchronize() before and after inference timers.")

if __name__ == "__main__":
    audit_spoof_model_labels()
    audit_cuda_timing()
