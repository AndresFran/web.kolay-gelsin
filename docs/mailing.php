<?php
include_once '../vendor/autoload.php';
include_once './sanitize.php';

// TODO: update this in order to block non
header("Access-Control-Allow-Methods:GET;  POST");
header('Content-type: application/json');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

$env = \Dotenv\Dotenv::createImmutable(__DIR__);
$env->load();

$rules = [
    'name' => 'string',
    'email' => 'email',
    'nationality' => 'string',
    'phone' => 'string',
    'living' => 'string',
    'know' => 'string',
    'message' => 'string',
];

try {

    onlyPostMethodAllowed();

    $data = sanitize($_POST, $rules);

    $status = sendEmail($data);

    echo json_encode($status);

    die;
} catch (\InvalidArgumentException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
    die;
} catch (\Exception|Throwable $e) {
    logError($e);
    echo json_encode(['error' => $e->getMessage()]);
}


function onlyPostMethodAllowed(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST')
        throw new InvalidArgumentException('GET method not allowed');
}

function parseMessage(array $data): string
{
    $message = "Message Received:" . PHP_EOL;

    $message .= "From {$data['name']} <{$data['email']}>, Phone: {$data['phone']}." . PHP_EOL;
    $message .= "Nationality: {$data['nationality']} <{$data['email']}>. Want to live in Antalya: {$data['living']}" . PHP_EOL;
    $message .= "How Know us: {$data['know']}" . PHP_EOL;

    $message .= "Message: {$data['message']}" . PHP_EOL;

    return wordwrap($message);
}

function logError(\Exception|Throwable|string $e): void
{
    $today = (new DateTime())->format('Y-m-d');
    error_log("{$e}" . PHP_EOL, 3, "{$_ENV['LOGS_FOLDER']}/{$today}-error.log");
}

function logEmail(string $mail): void
{
    $today = (new DateTime())->format('hd-m-Y-H-i-s');
    error_log($mail, 3, "{$_ENV['LOGS_FOLDER']}/{$today}-mail.log");

}


function sendEmail(array $data): array
{
    $message = parseMessage($data);
    try {
        $mail = new PHPMailer(true);

        //Enable verbose debug output
        $mail->SMTPDebug = SMTP::DEBUG_OFF;//Send using SMTP
        $mail->isSMTP();//Set the SMTP server to send through
        $mail->Host = $_ENV['SMTP_HOST'];//Enable SMTP authentication
        $mail->SMTPAuth = $_ENV['SMTP_AUTH'];//SMTP username
        $mail->Username = $_ENV['SMTP_USERNAME'];//SMTP password
        $mail->Password = $_ENV['SMTP_PASSWORD'];//Enable implicit TLS encryption
        $mail->SMTPSecure = $_ENV['SMTP_ENCRYPTION_METHOD'];//TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
        $mail->Port = $_ENV['SMTP_PORT'];//Recipients

        $mail->setFrom($data['email'], $data['name']);
        $mail->addAddress($_ENV['SMTP_RECEIVER_EMAIL'], $_ENV['SMTP_RECEIVER_NAME']);//Add a recipient
        $mail->Subject = $_ENV['SMTP_RECEIVER_SUBJECT'];
        $mail->Body = $message;

        $mail->send();
        return ['message' => 'Mail sent'];
    } catch (\PHPMailer\PHPMailer\Exception|Exception $e) {
        logError($e);
        throw new InvalidArgumentException($e->getMessage());
    } finally {
        logEmail($message);
    }
}
