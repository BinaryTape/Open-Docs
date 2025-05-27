---
title: 拡張機能マネージャー
---

`KoinExtension`マネージャーの簡単な説明です。これはKoinフレームワークに新しい機能を追加するために特化しています。

## 拡張機能の定義

Koin拡張機能は、`KoinExtension`インターフェースを継承するクラスを持つことによって構成されます。

```kotlin
interface KoinExtension {
    
    var koin : Koin
    
    fun onClose()
}
```

このインターフェースは、`Koin`インスタンスが確実に渡されること、そしてKoinがクローズする際に拡張機能が呼び出されることを保証します。

## 拡張機能の開始

拡張機能を開始するには、システムの適切な場所を拡張し、`Koin.extensionManager`で登録するだけです。

以下に、`coroutinesEngine`拡張機能を定義する方法を示します。

```kotlin
fun KoinApplication.coroutinesEngine() {
    with(koin.extensionManager) {
        if (getExtensionOrNull<KoinCoroutinesEngine>(EXTENSION_NAME) == null) {
            registerExtension(EXTENSION_NAME, KoinCoroutinesEngine())
        }
    }
}
```

以下に、`coroutinesEngine`拡張機能の呼び出し方法を示します。

```kotlin
val Koin.coroutinesEngine: KoinCoroutinesEngine get() = extensionManager.getExtension(EXTENSION_NAME)