[//]: # (title: Androidの依存関係を追加する)

Kotlin MultiplatformモジュールにAndroid固有の依存関係を追加するワークフローは、純粋なAndroidプロジェクトの場合と同じです。Gradleファイルで依存関係を宣言し、プロジェクトをインポートします。その後、Kotlinコードでこの依存関係を使用できます。

Kotlin Multiplatformプロジェクトでは、特定のAndroidソースセットにAndroidの依存関係を宣言することをお勧めします。そのためには、プロジェクトの`shared`ディレクトリにある`build.gradle(.kts)`ファイルを更新してください。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        androidMain.dependencies {
            implementation("com.example.android:app-magic:12.3")
        }
    } 
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        androidMain {
            dependencies {
                implementation 'com.example.android:app-magic:12.3'
            }
        }
    }
}
```

</TabItem>
</Tabs>

Androidプロジェクトのトップレベルの依存関係をマルチプラットフォームプロジェクトの特定のソースセットに移動する場合、そのトップレベルの依存関係に複雑な構成名が付いていると難しい場合があります。たとえば、Androidプロジェクトのトップレベルから`debugImplementation`依存関係を移動するには、`androidDebug`という名前のソースセットにimplementation依存関係を追加する必要があります。このような移行の問題に対処する手間を最小限に抑えるために、`androidTarget {}`ブロック内に`dependencies {}`ブロックを追加できます。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    androidTarget {
        //...
        dependencies {
            implementation("com.example.android:app-magic:12.3")
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    androidTarget {
        //...
        dependencies {
            implementation 'com.example.android:app-magic:12.3'
            }
        }
    }
}
```

</TabItem>
</Tabs>

ここで宣言された依存関係は、トップレベルブロックからの依存関係とまったく同じように扱われますが、この方法で宣言することで、ビルドスクリプト内でAndroidの依存関係が視覚的に分離され、より分かりやすくなります。

スクリプトの最後に、Androidプロジェクトに慣例的な方法でスタンドアロンの`dependencies {}`ブロックに依存関係を配置することもサポートされています。ただし、これを**強く推奨しません**。なぜなら、Androidの依存関係をトップレベルブロックに、他のターゲットの依存関係を各ソースセットに設定するビルドスクリプトは、混乱を招く可能性が高いからです。

## 次のステップ

マルチプラットフォームプロジェクトでの依存関係の追加に関する他のリソースも確認し、詳細については以下を参照してください。

* [公式Androidドキュメントでの依存関係の追加](https://developer.android.com/studio/build/dependencies)
* [マルチプラットフォームライブラリまたは他のマルチプラットフォームプロジェクトへの依存関係の追加](multiplatform-add-dependencies.md)
* [iOSの依存関係を追加する](multiplatform-ios-dependencies.md)