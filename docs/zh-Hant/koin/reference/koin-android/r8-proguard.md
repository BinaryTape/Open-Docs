---
title: R8 / ProGuard
---

本頁面說明 Koin 在程式碼縮減與混淆 (R8 / ProGuard) 下的行為、Koin 為您保留的內容，以及**您**需要在自己的應用程式中保留的內容。

## 懶人包 (TL;DR)

- **Koin 的核心解析對 R8 是安全的。** `get<T>()`、`inject<T>()` 以及 `*Of` 建構器 (`singleOf`、`factoryOf`、`viewModelOf` …) 是在**編譯期**解析相依性 — 它們使用具體化型別 (reified types)，且在 Android/JVM 上透過 `Class.getName()` 作為註冊表的鍵。**不會對您的建構函式進行執行期反射**，因此您**不需要**代表 Koin 保留您的定義、ViewModel 或其建構函式。
- Koin 在其 Android AAR (`koin-android`、`koin-core-viewmodel`、`koin-compose-viewmodel`、`koin-androidx-workmanager`、`koin-androidx-startup`) 中隨附了 `consumer-rules.pro`，因此下列規則會自動套用 — 您通常不需要新增任何內容。
- 您仍然需要保留由**其他部分**透過反射載入的類別（見下文）。

## Koin 為您保留的內容 (隨附的取用者規則)

AAR 會靜默關於 Koin 內部的 R8 警告：

```proguard
-dontwarn org.koin.**
```

`koin-androidx-startup` 額外保留了其在資訊清單中參照的初始設定式。這些規則都不會保留您的應用程式類別 — Koin 不需要保留它們。

## 您必須保留的內容

這些來自平台或程式庫，而非來自 Koin 的解析：

- **由 `KoinFragmentFactory` 建立的 Fragment** 是透過類別名稱具現化的。請保留您的 Fragment 子類別（通常已透過 `@Keep`、配置參照或 AndroidX 規則保留）。
- **WorkManager `ListenableWorker` 子類別** 由 `androidx.work` 自身的取用者規則保留。
- **針對程序終止的儲存狀態。** `SavedStateHandle` 是由 androidx 的 `CreationExtras` 提供，而非由 Koin 提供。您放入其中的值必須像任何其他儲存狀態一樣在 R8 中存續 — 請保留您自己的 `@Parcelize` / `Serializable` 狀態類別：

```proguard
# 範例 — 保留您自己的儲存狀態負載
-keep class com.example.** implements android.os.Parcelable { *; }
```

## ViewModels 與 SavedStateHandle (#2044)

一個常見的誤解是，間歇性的 `No definition found for SavedStateHandle` 損壞是由 R8 移除 Koin 的 ViewModel 反射所導致的。**並非如此** — `viewModelOf(::MyViewModel)` 是在編譯期決定的，因此在您的 ViewModel 上使用 `-keep` 不會改變 Koin 的解析行為。

`SavedStateHandle` 僅在 **ViewModel 建立期間**可用（它是從傳遞給工廠的 `CreationExtras` 中建置的）。請**直接在 ViewModel 建構函式中**解析它 — 不要延遲解析或在建構後解析：

```kotlin
// ✅ 在建立期間解析
class MyViewModel(val handle: SavedStateHandle) : ViewModel()

// ❌ 稍後解析 — 此時 CreationExtras 已經消失
class MyViewModel(koin: Koin) : ViewModel() {
    val handle by lazy { koin.get<SavedStateHandle>() } // fails
}
```

如果您在 `viewModelScope { }` 內宣告 ViewModel，請啟用對應的選項以便建立作用域：

```kotlin
startKoin {
    options(viewModelScopeFactory())
    modules(appModule)
}
```

## 非 Android 目標 (JS / WASM / Native)

在 Android/JVM 上，Koin 以 `Class.getName()` 作為註冊表的鍵，這在 R8 下是穩定的。在 **Kotlin/JS、WASM 和 Native** 上，Koin 使用來自 Kotlin 反射的 `qualifiedName` / `simpleName`。在這些目標上，激進的名稱縮減可能會影響型別識別 — 當您在非 Android 目標進行縮減時，建議使用**具名限定詞** (`named("...")`)，而非依賴類別名稱。