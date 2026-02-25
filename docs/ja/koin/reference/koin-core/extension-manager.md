---
title: Extensionマネージャー
---

ここでは、Koinフレームワーク内に新機能を追加するための`KoinExtension`マネージャーについて簡単に説明します。

## エクステンションの定義

Koinエクステンションは、`KoinExtension`インターフェースを継承するクラスを作成することで定義します。

```kotlin
interface KoinExtension {

    fun onRegister(koin : Koin)

    fun onClose()
}
```

このインターフェースにより、`Koin`インスタンスが確実に渡されることが保証され、Koinのクローズ（終了）時にエクステンションが呼び出されるようになります。

## エクステンションの開始

エクステンションを開始するには、システムの適切な箇所を拡張し、`Koin.extensionManager`に登録します。

以下は、`coroutinesEngine`エクステンションを定義する方法の例です。

```kotlin
fun KoinApplication.coroutinesEngine() {
    with(koin.extensionManager) {
        if (getExtensionOrNull<KoinCoroutinesEngine>(EXTENSION_NAME) == null) {
            registerExtension(EXTENSION_NAME, KoinCoroutinesEngine())
        }
    }
}
```

以下は、`coroutinesEngine`エクステンションを呼び出す方法です。

```kotlin
val Koin.coroutinesEngine: KoinCoroutinesEngine get() = extensionManager.getExtension(EXTENSION_NAME)
```

## リゾルバーエンジンとResolution Extension

Koinの解決（resolution）アルゴリズムは、プラグイン可能で拡張できるように再構築されました。新しいCoreResolverおよびResolutionExtension APIにより、外部システムとの統合やカスタム解決ロジックの実装が可能になります。

内部的には、解決処理がスタック要素をより効率的に走査するようになり、スコープや親階層をまたぐ伝播がよりクリーンになりました。これにより、リンクされたスコープの探索に関連する多くの問題が修正され、Koinを他のシステムへより適切に統合できるようになります。

以下に、Resolution Extensionをデモするテストコードを示します。

```kotlin
@Test
fun extend_resolution_test(){
    val resolutionExtension = object : ResolutionExtension {
        val instanceMap = mapOf<KClass<*>, Any>(
            Simple.ComponentA::class to Simple.ComponentA()
        )

        override val name: String = "hello-extension"
        override fun resolve(
            scope: Scope,
            instanceContext: ResolutionContext
        ): Any? {
            return instanceMap[instanceContext.clazz]
        }
    }

    val koin = koinApplication{
        printLogger(Level.DEBUG)
        koin.resolver.addResolutionExtension(resolutionExtension)
        modules(module {
            single { Simple.ComponentB(get())}
        })
    }.koin

    assertEquals(resolutionExtension.instanceMap[Simple.ComponentA::class], koin.get<Simple.ComponentB>().a)
    assertEquals(1,koin.instanceRegistry.instances.values.size)
}