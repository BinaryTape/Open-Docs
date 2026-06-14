---
title: R8 / ProGuard
---

このページでは、コードの圧縮と難読化（R8 / ProGuard）環境下での Koin の動作、Koin が自動で保持するもの、および**ユーザー自身**がアプリ内で保持する必要があるものについて説明します。

## TL;DR

- **Koin のコアの解決処理は R8 セーフです。** `get<T>()`、`inject<T>()`、および `*Of` ビルダー（`singleOf`、`factoryOf`、`viewModelOf` など）は、依存関係を**コンパイル時**に解決します。これらは具体化された型（reified types）を使用し、Android/JVM では `Class.getName()` をキーとしてレジストリを管理します。**コンストラクタに対する実行時のリフレクションは行われない**ため、Koin のために定義、ViewModel、またはそれらのコンストラクタを保持（keep）する必要はありません。
- Koin は、Android AAR（`koin-android`、`koin-core-viewmodel`、`koin-compose-viewmodel`、`koin-androidx-workmanager`、`koin-androidx-startup`）内に `consumer-rules.pro` を含んでいるため、以下のルールは自動的に適用されます。通常、ユーザーが何かを追加する必要はありません。
- ただし、**他の何か**がリフレクションを使用してロードするクラスについては、引き続き保持する必要があります（後述）。

## Koin が自動で保持するもの（同梱のコンシューマー・ルール）

AAR は、Koin の内部に関する R8 の警告を抑制します。

```proguard
-dontwarn org.koin.**
```

`koin-androidx-startup` はさらに、マニフェストで参照されている initializer を保持します。これらはいずれもアプリケーションのクラスを保持するものではありません。Koin はそれらを保持する必要がないからです。

## ユーザーが保持する必要があるもの

これらは Koin の解決メカニズムによるものではなく、プラットフォームやライブラリに起因するものです。

- **`KoinFragmentFactory` によって作成される Fragment** は、クラス名によってインスタンス化されます。Fragment のサブクラスを保持してください（通常、これらは `@Keep`、レイアウトでの参照、または AndroidX のルールによって既に保持されています）。
- **WorkManager の `ListenableWorker` サブクラス** は、`androidx.work` 独自のコンシューマー・ルールによって保持されます。
- **プロセス終了（process death）時の保存済み状態（Saved state）。** `SavedStateHandle` は Koin ではなく androidx の `CreationExtras` によって提供されます。そこに保存する値は、他の保存済み状態と同様に R8 を通過する必要があります。独自の `@Parcelize` / `Serializable` な状態クラスを保持してください。

```proguard
# 例 — 独自の保存済み状態のペイロードを保持する
-keep class com.example.** implements android.os.Parcelable { *; }
```

## ViewModels と SavedStateHandle (#2044)

時折発生する `No definition found for SavedStateHandle` というクラッシュは、R8 が Koin の ViewModel リフレクションを削除したことが原因であると一般に信じられていますが、**そうではありません**。`viewModelOf(::MyViewModel)` はコンパイル時に解決されるため、ViewModel に `-keep` を指定しても Koin の解決動作は変わりません。

`SavedStateHandle` は、**ViewModel の作成中のみ**利用可能です（ファクトリに渡される `CreationExtras` から構築されます）。`SavedStateHandle` は**ViewModel のコンストラクタ内で直接**解決してください。遅延解決や構築後の解決は行わないでください。

```kotlin
// ✅ 作成時に解決される
class MyViewModel(val handle: SavedStateHandle) : ViewModel()

// ❌ 後で解決される — その時点では CreationExtras は破棄されている
class MyViewModel(koin: Koin) : ViewModel() {
    val handle by lazy { koin.get<SavedStateHandle>() } // 失敗する
}
```

`viewModelScope { }` 内で ViewModel を宣言する場合は、スコープを作成できるように対応するオプションを有効にしてください。

```kotlin
startKoin {
    options(viewModelScopeFactory())
    modules(appModule)
}
```

## Android 以外のターゲット (JS / WASM / Native)

Android/JVM では、Koin は `Class.getName()` を使用してレジストリを管理しており、これは R8 下でも安定しています。**Kotlin/JS、WASM、および Native** では、Koin は Kotlin リフレクションの `qualifiedName` / `simpleName` を使用します。これらのターゲットでアグレッシブな名前の最小化（minify）を行うと、型の同一性に影響を与える可能性があります。Android 以外のターゲットを最小化する場合は、クラス名に依存するのではなく、**名前付きクオリファイア**（`named("...")`）を使用することをお勧めします。