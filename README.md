# aws-cloudtrail-slack
aws-cloudtrail-slack  
CloudTrailで取得できるIAMユーザーのコンソール操作履歴をSlackに通知するためのLambdaファンクションです。

## 導入

### ローカル

前提: Node.js 6.1系以上がインストールされていること。

1. AWS CLIの導入  
以下のURLを参考に、デプロイするアカウント、リージョンを登録するところまで行ってください。  
https://aws.amazon.com/jp/cli/

1. Serverlessのインストール  
以下のコマンドを使用して、Serverlessをグローバルインストールします。  
> npm install -g serverless  

1. 必要パッケージのインストール
以下のコマンドを使用してpackage.jsonに記載されている依存パッケージを取得します。  
> npm install   

1. 設定ファイルの編集  
設定ファイル(serverless.yml)の以下の箇所を変更します。  
environmentの項目ではLambdaの環境変数に設定する値を記述します。
    ```
    provider:
      stage: dev
      region: ap-northeast-1

    environment:
      SLACK_TOKEN: <slack-token>
      SLACK_CHANNEL: <slack-channel>
      SLACK_USERNAME: CloudTrail
    ```
stage: デプロイメントのステージを設定します。  
region: デプロイ先のリージョンを指定します。  
SLACK_TOKEN: SlackのAPI token
SLACK_CHANNEL: Slackのチャンネル名
SLACK_USERNAME: Slackに投稿するユーザー名

1. デプロイ  
本プログラムのルートディレクトリに移動して、以下のコマンドを実行します。  
> sls deploy  

1. テスト  
以下のコマンドを実行すると、CLI上からLambdaファンクションの実行が行なえます。  
> sls invoke -f notify

### AWS
「導入>ローカル」の手順でAWSへのデプロイまでが完了しますが、AWS上で環境変数を書き換えなどを行う方法を説明します。

1. AWSコンソールにログインする  
「導入>ローカル」の1. の手順で設定したアカウントを使用してAWSコンソールにログインします。

1. デプロイしたLambdaファンクションの設定画面を開く  
サービス一覧から「Lambda」を開いた後、「関数」から今回デプロイした関数を選択します。  

1. 環境変数の設定
環境変数を変更することで、発信先の電話番号などを変更することが可能です。  
「コード」タブを選択し、下部の「環境変数」から環境変数の変更が行なえます。  
変更後は、「保存」を選択します。  

以上
