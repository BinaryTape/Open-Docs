---
title: モジュール
---

Koinを使用すると、モジュール内で定義を記述します。このセクションでは、モジュールの宣言、整理、およびリンク方法について説明します。

## モジュールとは？

Koinモジュールは、Koinの定義をまとめるための「空間」です。`module` 関数で宣言します。

```kotlin
val myModule = module {
    // Your definitions ...
}
```

## 複数のモジュールを使用する

コンポーネントは必ずしも同じモジュールにある必要はありません。モジュールは定義を整理するのに役立つ論理的な空間であり、他のモジュールの定義に依存することもできます。定義は遅延（lazy）であり、コンポーネントが要求したときにのみ解決されます。

別々のモジュールにリンクされたコンポーネントの例を見てみましょう。

```kotlin
// ComponentB <- ComponentA
class ComponentA()
class ComponentB(val componentA : ComponentA)

val moduleA = module {
    // Singleton ComponentA
    single { ComponentA() }
}

val moduleB = module {
    // Singleton ComponentB with linked instance ComponentA
    single { ComponentB(get()) }
}
```

:::info
Koinにはインポートの概念はありません。Koinの定義は遅延（lazy）です。Koin定義はKoinコンテナで開始されますが、インスタンス化はされません。インスタンスは、その型に対する要求が行われたときにのみ作成されます。
:::

Koinコンテナを起動するときに、使用するモジュールのリストを宣言するだけです。

```kotlin
// Start Koin with moduleA & moduleB
startKoin {
    modules(moduleA,moduleB)
}
```

Koinは、指定されたすべてのモジュールから依存関係を解決します。

## 定義またはモジュールのオーバーライド (3.1.0以降)

新しいKoinのオーバーライド戦略では、デフォルトで任意の定義をオーバーライドできます。モジュール内で `override = true` を指定する必要はなくなりました。

異なるモジュールに同じマッピングを持つ2つの定義がある場合、後者の定義が現在の定義をオーバーライドします。

```kotlin
val myModuleA = module {
    single<Service> { ServiceImp() }
}
val myModuleB = module {
    single<Service> { TestServiceImp() }
}

startKoin {
    // TestServiceImp will override ServiceImp definition
    modules(myModuleA,myModuleB)
}
```

定義マッピングのオーバーライドについては、Koinのログで確認できます。

Koinアプリケーションの設定で `allowOverride(false)` を使用して、オーバーライドを許可しないように指定できます。

```kotlin
startKoin {
    // Forbid definition override
    allowOverride(false)
}
```

オーバーライドを無効にした場合、Koinはオーバーライドが試行されると `DefinitionOverrideException` 例外をスローします。

## モジュールの共有

`module { }` 関数を使用すると、Koinはすべてのインスタンスファクトリを事前に割り当てます。モジュールを共有する必要がある場合は、関数でモジュールを返すことを検討してください。

```kotlin
fun sharedModule() = module {
    // Your definitions ...
}
```

このようにすることで、定義を共有し、値でファクトリを事前に割り当てることを避けることができます。

## 定義またはモジュールのオーバーライド (3.1.0より前)

Koinは、既に存在する定義（型、名前、パスなど）を再定義することを許可しません。これを試みるとエラーになります。

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    single<Service> { TestServiceImp() }
}

// Will throw an BeanOverrideException
startKoin {
    modules(myModuleA,myModuleB)
}
```

定義のオーバーライドを許可するには、`override` パラメータを使用する必要があります。

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    // override for this definition
    single<Service>(override=true) { TestServiceImp() }
}
```

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

// Allow override for all definitions from module
val myModuleB = module(override=true) {

    single<Service> { TestServiceImp() }
}
```

:::note
モジュールをリストアップし、定義をオーバーライドする際には順序が重要です。オーバーライドする定義は、モジュールリストの最後に配置する必要があります。
:::

## モジュールのリンク戦略

モジュール間の定義は遅延（lazy）であるため、モジュールを使用して異なる戦略実装を導入できます。つまり、モジュールごとに実装を宣言できます。

RepositoryとDatasourceの例を見てみましょう。リポジトリはDatasourceを必要とし、Datasourceはローカル（Local）またはリモート（Remote）の2つの方法で実装できます。

```kotlin
class Repository(val datasource : Datasource)
interface Datasource
class LocalDatasource() : Datasource
class RemoteDatasource() : Datasource
```

これらのコンポーネントを3つのモジュールで宣言できます。Repositoryモジュールと、各Datasource実装ごとのモジュールです。

```kotlin
val repositoryModule = module {
    single { Repository(get()) }
}

val localDatasourceModule = module {
    single<Datasource> { LocalDatasource() }
}

val remoteDatasourceModule = module {
    single<Datasource> { RemoteDatasource() }
}
```

次に、適切なモジュールの組み合わせでKoinを起動するだけです。

```kotlin
// Load Repository + Local Datasource definitions
startKoin {
    modules(repositoryModule,localDatasourceModule)
}

// Load Repository + Remote Datasource definitions
startKoin {
    modules(repositoryModule,remoteDatasourceModule)
}
```

## モジュールのインクルード (3.2以降)

`Module` クラスに新しい関数 `includes()` が追加されました。これにより、他のモジュールを整理された構造的な方法で含めることで、モジュールを構成できるようになります。

この新機能の主な2つのユースケースは次のとおりです。
- 大きなモジュールをより小さく、より焦点を絞ったモジュールに分割する。
- モジュール化されたプロジェクトにおいて、モジュールの可視性をより細かく制御できるようになります（以下の例を参照）。

どのように機能するのでしょうか？いくつかのモジュールを例にとり、それらを `parentModule` に含めてみましょう。

```kotlin
// `:feature` module
val childModule1 = module {
    /* Other definitions here. */
}
val childModule2 = module {
    /* Other definitions here. */
}
val parentModule = module {
    includes(childModule1, childModule2)
}

// `:app` module
startKoin { modules(parentModule) }
```

すべてのモジュールを明示的に設定する必要がないことに注目してください。`parentModule` を含めることで、`includes` で宣言されたすべてのモジュール（`childModule1` と `childModule2`）が自動的にロードされます。言い換えれば、Koinは実質的に `parentModule`、`childModule1`、`childModule2` をロードしています。

注目すべき重要な詳細として、`includes` を使用して `internal` および `private` モジュールも追加できるという点があります。これにより、モジュール化されたプロジェクトで何を公開するかについて柔軟性が得られます。

:::info
モジュールのロードは、すべてのモジュールグラフをフラット化し、モジュールの定義の重複を回避するように最適化されています。
:::

最後に、複数のネストされたモジュールや重複するモジュールを含めることができ、Koinは含まれるすべてのモジュールをフラット化し、重複を削除します。

```kotlin
// :feature module
val dataModule = module {
    /* Other definitions here. */
}
val domainModule = module {
    /* Other definitions here. */
}
val featureModule1 = module {
    includes(domainModule, dataModule)
}
val featureModule2 = module {
    includes(domainModule, dataModule)
}

// `:app` module
startKoin { modules(featureModule1, featureModule2) }
```

すべてのモジュールが一度だけ含まれることに注目してください。`dataModule`、`domainModule`、`featureModule1`、`featureModule2`です。

:::info
同じファイルからモジュールを含める際にコンパイルの問題が発生した場合、モジュールでKotlinの属性演算子 `get()` を使用するか、各モジュールをファイルに分けるかしてください。回避策については https://github.com/InsertKoinIO/koin/issues/1341 を参照してください。
:::