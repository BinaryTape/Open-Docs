---
title: "@Monitor による Koin の組み込みパフォーマンス・モニタリング"
---

`@Monitor` アノテーション（Koin Annotations 2.2.0 以降で利用可能）は、Koin の公式ツール・プラットフォームである [Kotzilla Platform](https://kotzilla.io) を通じて、Koin コンポーネントの自動的なパフォーマンス・モニタリングとトレースを可能にします。

## セットアップ

Kotzilla SDK の依存関係を追加します：

```kotlin
dependencies {
    implementation "io.kotzilla:kotzilla-core:latest.version"
}
```

Kotzilla ドキュメントで [最新バージョン](https://doc.kotzilla.io/docs/releaseNotes/changelogSDK) を確認してください。

モニタリング対象のクラスを拡張可能にするために、`allOpen` プラグインを構成します：

```kotlin
plugins {
    id "org.jetbrains.kotlin.plugin.allopen"
}

allOpen {
    annotation("org.koin.core.annotation.Monitor")
}
```

Koin 構成で Kotzilla アナリティクスを初期化します：

```kotlin
import io.kotzilla.sdk.analytics.koin.analytics

fun initKoin() {
    startKoin {
        // Kotzilla モニタリングを有効にする
        analytics()
        modules(appModule)
    }
}
```

## 基本的な使い方

Koin コンポーネントに `@Monitor` を付与するだけです：

```kotlin
@Monitor
@Single
class UserService(private val userRepository: UserRepository) {
    fun findUser(id: String): User? = userRepository.findById(id)
    
    suspend fun createUser(userData: UserData): User {
        return userRepository.save(userData)
    }
}
```

## 生成されるコード

コンパイラは、コンポーネントをラップするプロキシ・クラスを自動的に生成します：

```kotlin
/**
 * @Monitor によって生成された 'UserService' の Koin プロキシ
 */
class UserServiceProxy(userRepository: UserRepository) : UserService(userRepository) {
    override fun findUser(id: String): User? { 
        return KotzillaCore.getDefaultInstance().trace("UserService.findUser") { 
            super.findUser(id) 
        } 
    }
    
    override suspend fun createUser(userData: UserData): User { 
        return KotzillaCore.getDefaultInstance().suspendTrace("UserService.createUser") { 
            super.createUser(userData) 
        } 
    }
}
```

Koin は元のクラスの代わりにプロキシを自動的に使用し、以下を透過的にキャプチャします：
- メソッドの実行時間
- 呼び出し頻度とパターン
- エラー率とエラーの種類
- パフォーマンスのボトルネック

## ViewModel のモニタリング

UI パフォーマンスを追跡するために、ViewModel をモニタリングします：

```kotlin
@Monitor
@KoinViewModel
class DetailViewModel(private val repository: Repository) : ViewModel() {
    fun loadData(id: String): StateFlow<Data> = repository.getData(id)
}
```

## Kotzilla Platform との統合

モニタリング・データは [Kotzilla Platform](https://kotzilla.io) ワークスペースに自動的に送信され、以下を提供します：

- **リアルタイム・パフォーマンス・ダッシュボード**: メソッドの実行時間とトレンドを表示
- **エラー・トラッキング**: 例外発生率とスタックトレースをモニタリング
- **利用状況分析**: どのコンポーネントが最も頻繁に使用されているかを把握
- **パフォーマンス・アラート**: パフォーマンスの低下（レグレッション）の通知を受け取る

無料の Kotzilla アカウントを作成し、`kotzilla.json` ファイルで API キーを設定します：

```json
{
  "sdkVersion": "latest.version",
  "keys": [
    {
      "appId": "your-app-id",
      "applicationPackageName": "com.example.app",
      "keyId": "your-key-id", 
      "apiKey": "your-api-key"
    }
  ]
}
```

## 要件

- `@Monitor` が付与されたクラスは open である必要があります（`allOpen` プラグインによって自動的に処理されます）
- 実行時に Kotzilla SDK の依存関係が利用可能である必要があります
- データ収集のための有効な Kotzilla Platform アカウントと API キーが必要です

:::info
`@Monitor` アノテーションは、モニタリング対象のクラス自体に対するメソッド呼び出しのみを追跡します。モニタリング対象のクラスに注入された依存関係は、それら自体に `@Monitor` が付与されていない限り、自動的にモニタリングされることはありません。
:::

:::note
セットアップ手順の詳細や高度な構成オプションについては、[Kotzilla ドキュメント](https://doc.kotzilla.io)をご覧ください。
:::