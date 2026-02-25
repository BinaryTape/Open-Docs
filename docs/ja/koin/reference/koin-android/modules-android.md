---
title: Androidにおける複数のKoinモジュール
---

Koinを使用すると、モジュール内に定義を記述します。このセクションでは、モジュールの宣言、整理、およびリンクの方法について説明します。

## 複数のモジュールの使用

コンポーネントは必ずしも同じモジュール内にある必要はありません。モジュールは定義を整理するための論理的なスペースであり、別のモジュールの定義に依存することができます。定義は遅延（lazy）され、コンポーネントがそれらを要求したときにのみ解決されます。

別のモジュールにあるコンポーネントをリンクする例を見てみましょう：

```kotlin
// ComponentB <- ComponentA
class ComponentA()
class ComponentB(val componentA : ComponentA)

val moduleA = module {
    // ComponentAのシングルトン
    single { ComponentA() }
}

val moduleB = module {
    // ComponentAのインスタンスをリンクしたComponentBのシングルトン
    single { ComponentB(get()) }
}
```

Koinコンテナを起動する際に、使用するモジュールのリストを宣言するだけです：

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // ...

            // モジュールのロード
            modules(moduleA, moduleB)
        }
        
    }
}
```

Gradleモジュールごとに整理し、複数のKoinモジュールをまとめるかどうかはあなた次第です。

> 詳細については [Koin Modules セクション](/docs/reference/koin-core/modules) を確認してください。

## モジュールの包含（includes）（3.2以降）

`Module` クラスで新しい関数 `includes()` が利用可能になりました。これにより、他のモジュールを整理された構造化された方法で含めることで、モジュールを構成できます。

この新機能の主なユースケースは次の2つです：
- 大きなモジュールを、より小さく、目的を絞ったモジュールに分割する。
- モジュール化されたプロジェクトにおいて、モジュールの可視性をより細かく制御できる（以下の例を参照）。

どのように動作するのでしょうか？いくつかのモジュールを例にとり、`parentModule` にモジュールを含めてみます：

```kotlin
// `:feature` モジュール
val childModule1 = module {
    /* ここに他の定義 */
}
val childModule2 = module {
    /* ここに他の定義 */
}
val parentModule = module {
    includes(childModule1, childModule2)
}

// `:app` モジュール
startKoin { modules(parentModule) }
```

すべてのモジュールを明示的に設定する必要はないことに注意してください。`parentModule` を含めることで、`includes` で宣言されたすべてのモジュール（`childModule1` と `childModule2`）が自動的にロードされます。言い換えれば、Koinは実質的に `parentModule`、`childModule1`、`childModule2` をロードしています。

注目すべき重要な詳細は、`includes` を使用して `internal` や `private` モジュールも追加できることです。これにより、モジュール化されたプロジェクトで何を公開するかについて柔軟性が得られます。

:::info
モジュールのロードが最適化され、すべてのモジュールグラフがフラット化され、モジュールの重複定義が回避されるようになりました。
:::

最後に、ネストされた複数のモジュールや重複するモジュールを含めることができ、Koinは重複を削除してすべての含まれるモジュールをフラット化します：

```kotlin
// :feature モジュール
val dataModule = module {
    /* ここに他の定義 */
}
val domainModule = module {
    /* ここに他の定義 */
}
val featureModule1 = module {
    includes(domainModule, dataModule)
}
val featureModule2 = module {
    includes(domainModule, dataModule)
}
```

```kotlin
// `:app` モジュール
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // ...

            // モジュールのロード
             modules(featureModule1, featureModule2)
        }
        
    }
}
```

すべてのモジュール（`dataModule`、`domainModule`、`featureModule1`、`featureModule2`）が一度だけ含まれることに注意してください。

## バックグラウンドでのモジュールロードによる起動時間の短縮

リソースの事前割り当てをトリガーせず、Koinの開始とともにバックグラウンドでロードする「lazy」なKoinモジュールを宣言できるようになりました。これにより、バックグラウンドでロードされるlazyモジュールを渡すことで、Androidの起動プロセスのブロックを回避できます。

- `lazyModule` - KoinモジュールのLazy Kotlin版を宣言します。
- `Module.includes` - lazyモジュールの包含を許可します。
- `KoinApplication.lazyModules` - プラットフォームのデフォルトの Dispatchers に従い、コルーチンを使用してバックグラウンドでlazyモジュールをロードします。
- `Koin.waitAllStartJobs` - 開始ジョブの完了を待ちます。
- `Koin.runOnKoinStarted` - 開始完了後にコードブロックを実行します。

理解を深めるための例を以下に示します：

```kotlin

// 遅延ロードされるモジュール
val m2 = lazyModule {
    singleOf(::ClassB)
}

val m1 = module {
    singleOf(::ClassA) { bind<IClassA>() }
}

startKoin {
    // 同期モジュールのロード
    modules(m1)
    // バックグラウンドでlazyモジュールをロード
    lazyModules(m2)
}

val koin = KoinPlatform.getKoin()

// 開始の完了を待機
koin.waitAllStartJobs()

// または開始後にコードを実行
koin.runOnKoinStarted { koin ->
    // バックグラウンドロード完了後に実行
}